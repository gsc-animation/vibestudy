# **Bản thiết kế Kiến trúc Phần mềm Giáo dục Data-Driven: Tích hợp ReactJS, JSON và AI cho Chương trình Tiểu học Cambridge**

## **1\. Tổng quan Điều hành và Phạm vi Nghiên cứu**

Trong bối cảnh chuyển đổi số giáo dục, nhu cầu về các nền tảng học tập cá nhân hóa tại nhà đang gia tăng mạnh mẽ, đặc biệt đối với các chương trình quốc tế có cấu trúc phức tạp như Cambridge Primary. Báo cáo này trình bày một nghiên cứu chuyên sâu và bản thiết kế kỹ thuật cho một hệ thống phần mềm giáo dục được tối ưu hóa cho quy trình học tập của học sinh tiểu học (hệ Cambridge) và vai trò quản lý giám sát của phụ huynh. Kiến trúc đề xuất không dựa trên các hệ quản trị cơ sở dữ liệu máy chủ truyền thống (như MySQL hay MongoDB) mà áp dụng mô hình "Jamstack" hiện đại, sử dụng ReactJS cho giao diện người dùng, cơ sở dữ liệu JSON cục bộ (Local JSON DB) được quản lý qua Git, và triển khai trên hạ tầng Netlify.

Điểm cốt lõi của giải pháp này là triết lý thiết kế "Data-Driven" (Hướng dữ liệu) kết hợp với quy trình tự động hóa bằng Trí tuệ nhân tạo (AI). Hệ thống được thiết kế để giải quyết bài toán cốt lõi: làm thế nào để phụ huynh \- những người không có kỹ năng lập trình \- có thể cập nhật nội dung học tập (từ vựng, đề cương ôn tập, bài kiểm tra) một cách linh hoạt, tức thì, bám sát theo tiến độ thực tế tại trường học mà không cần can thiệp vào mã nguồn phần mềm.

Báo cáo sẽ đi sâu vào phân tích các yêu cầu sư phạm của phương pháp CLIL (Content and Language Integrated Learning) đặc thù của Cambridge, từ đó chuyển hóa thành các đặc tả kỹ thuật cho lược đồ dữ liệu JSON. Đồng thời, nghiên cứu cũng chi tiết hóa quy trình sử dụng các Mô hình Ngôn ngữ Lớn (LLM) để phân tích các tài liệu ôn tập phi cấu trúc (email giáo viên, file PDF) thành dữ liệu có cấu trúc, tạo nên một vòng khép kín giữa nhà trường, phụ huynh và học sinh.

## ---

**2\. Phân tích Ngữ cảnh Sư phạm và Yêu cầu Hệ thống**

Để kiến trúc phần mềm thực sự hiệu quả, nó phải phản ánh chính xác các nguyên tắc sư phạm của chương trình Cambridge Primary. Việc thiết kế cơ sở dữ liệu và giao diện người dùng không chỉ là vấn đề kỹ thuật mà là sự phản chiếu của tư duy giáo dục.

### **2.1 Phương pháp CLIL và Tác động đến Kiến trúc Dữ liệu**

Chương trình Cambridge Primary, đặc biệt là các môn Toán (Maths) và Khoa học (Science) giảng dạy bằng tiếng Anh cho học sinh không phải người bản xứ (ESL), vận hành dựa trên khung phương pháp CLIL. Theo các nghiên cứu của Cambridge English, CLIL bao gồm 4 yếu tố trụ cột (The 4Cs): Nội dung (Content), Giao tiếp (Communication), Nhận thức (Cognition), và Văn hóa (Culture).1 Kiến trúc phần mềm phải đáp ứng từng yếu tố này:

#### **2.1.1 Nội dung (Content) và Cấu trúc Phân cấp**

Trong CLIL, nội dung học tập dẫn dắt việc học ngôn ngữ. Ví dụ, khi học về "Toán học", học sinh không chỉ tính toán mà còn phải hiểu các khái niệm như "hypothesis" (giả thuyết) hay "divisible" (có thể chia hết).1

* **Hệ quả kiến trúc:** Cơ sở dữ liệu JSON không thể là một danh sách phẳng. Nó phải có cấu trúc phân cấp chặt chẽ: Stage (Lớp) \-\> Unit (Chương) \-\> Topic (Chủ đề). Mỗi đơn vị dữ liệu (ví dụ: một câu hỏi trắc nghiệm) phải được gắn thẻ (tag) metadata chính xác với Learning Objective (Mục tiêu học tập) của Cambridge (ví dụ: mã 0097/01 cho Khoa học lớp 1).2 Điều này cho phép hệ thống "Cập nhật tiến độ theo chương trình trường học" một cách chính xác, đảm bảo học sinh lớp 3 không gặp lại nội dung sơ cấp của lớp 1 trừ khi đó là mục đích ôn tập xoáy trôn ốc.

#### **2.1.2 Giao tiếp (Communication) và Từ vựng Chuyên ngành**

Yếu tố Giao tiếp trong CLIL đòi hỏi học sinh phải nắm vững "ngôn ngữ của môn học" (Language of learning). Phân tích các tài liệu giảng dạy cho thấy từ vựng được chia thành 3 tầng (Tier):

* **Tier 1:** Từ vựng cơ bản hàng ngày (ví dụ: sun, rain).  
* **Tier 2:** Từ vựng học thuật chung (ví dụ: observe, compare).  
* **Tier 3:** Từ vựng chuyên ngành sâu (ví dụ: photosynthesis, opaque, vertebrate).3  
* **Hệ quả kiến trúc:** Schema (lược đồ) JSON cho đối tượng Vocabulary phải bao gồm trường tier (cấp độ) và context (ngữ cảnh). Hệ thống cần hỗ trợ tính năng đa phương tiện (audio phát âm, hình ảnh minh họa) để hỗ trợ học sinh ESL, và đặc biệt là các trường dữ liệu cho phép phụ huynh nhập "định nghĩa đơn giản hóa" hoặc "dịch nghĩa tiếng Việt" để làm cầu nối ngôn ngữ.5

#### **2.1.3 Nhận thức (Cognition) và Cơ chế Game hóa**

CLIL yêu cầu phát triển các kỹ năng tư duy từ thấp đến cao (thang Bloom): nhớ, hiểu, vận dụng, phân tích, đánh giá, sáng tạo.1

* **Hệ quả kiến trúc:** Hệ thống không thể chỉ dừng lại ở các bài quiz trắc nghiệm (A/B/C/D) vốn chỉ kiểm tra trí nhớ. Kiến trúc ReactJS phải hỗ trợ các "Game Engine" (Động cơ trò chơi) linh hoạt cho phép các tương tác phức tạp hơn như:  
  * **Phân loại (Classifying):** Kéo thả các loài vật vào nhóm "Có xương sống" hoặc "Không xương sống".6  
  * **Sắp xếp (Ordering):** Sắp xếp quy trình vòng đời của cây.7  
  * Lập luận (Reasoning): Các bài tập điền khuyết yêu cầu logic "Nếu... thì...".  
    Dữ liệu JSON phải định nghĩa được luật chơi chứ không chỉ là nội dung câu hỏi, cho phép mở rộng các loại hình game mới mà không cần viết lại mã nguồn (Coding-free expansion).

### **2.2 Vai trò Quản lý Kép: Phụ huynh và Học sinh**

Hệ thống phải phục vụ hai đối tượng người dùng với nhu cầu trái ngược nhau nhưng liên kết chặt chẽ:

| Đối tượng | Nhu cầu | Yêu cầu Kiến trúc |
| :---- | :---- | :---- |
| **Học sinh (Learner)** | Giao diện trực quan, tương tác cao, phản hồi tức thì, gamification (huy hiệu, điểm số). | React Components tối ưu hiệu năng, LocalStorage để lưu trạng thái offline, Web Speech API cho phát âm.8 |
| **Phụ huynh (Manager)** | Nhập liệu nhanh chóng, theo dõi tiến độ sát sao, cấu hình bài kiểm tra, bảo mật dữ liệu. | Decap CMS để quản lý nội dung, Dashboard phân tích dữ liệu, Quy trình AI để xử lý văn bản đầu vào.9 |

Sự tách biệt này dẫn đến kiến trúc Frontend (Giao diện học tập) và Admin (Giao diện quản lý nội dung) hoạt động độc lập nhưng chia sẻ chung một nguồn dữ liệu JSON (Single Source of Truth).

## ---

**3\. Kiến trúc Kỹ thuật Tổng thể: Jamstack và Netlify**

Để đáp ứng yêu cầu về "ReactJS \+ JSON Local DB trên Netlify", kiến trúc Jamstack (JavaScript, APIs, Markup) là lựa chọn tối ưu. Đây là mô hình hiện đại giúp tách biệt phần giao diện (Frontend) khỏi phần quản trị nội dung (Content Management), loại bỏ sự phức tạp và chi phí duy trì của các máy chủ cơ sở dữ liệu truyền thống.

### **3.1 Lựa chọn Công nghệ và Biện luận**

#### **3.1.1 ReactJS: Thư viện Giao diện**

ReactJS được chọn làm nền tảng phát triển frontend nhờ khả năng tái sử dụng thành phần (Component-Based Architecture).10 Trong bối cảnh giáo dục, điều này cực kỳ quan trọng. Chúng ta có thể xây dựng một thành phần QuizCard duy nhất và tái sử dụng nó cho hàng nghìn câu hỏi khác nhau chỉ bằng cách thay đổi dữ liệu đầu vào (props). Hệ sinh thái React cũng cung cấp các thư viện mạnh mẽ như react-dnd (cho game kéo thả) và react-router (điều hướng trang), giúp xây dựng trải nghiệm người dùng mượt mà như một ứng dụng native (Single Page Application \- SPA).11

#### **3.1.2 Netlify: Hạ tầng và CI/CD**

Netlify đóng vai trò là nền tảng lưu trữ và quy trình triển khai liên tục (CI/CD).

* **Cơ chế hoạt động:** Mã nguồn và dữ liệu JSON được lưu trữ trên Git (GitHub/GitLab). Khi phụ huynh cập nhật nội dung qua CMS, một lệnh commit được gửi lên Git. Netlify tự động phát hiện thay đổi này và kích hoạt quy trình "Build" (xây dựng lại trang web).  
* **Lợi ích:** Đảm bảo tính nhất quán của dữ liệu. Phụ huynh không bao giờ phải lo lắng về việc bảo trì máy chủ, sao lưu dữ liệu hay lỗi kết nối cơ sở dữ liệu. Mọi phiên bản nội dung đều được lưu vết trong lịch sử Git, cho phép khôi phục (rollback) bất cứ lúc nào.13

#### **3.1.3 JSON Local DB: Cơ sở dữ liệu Phi máy chủ**

Thay vì sử dụng SQL, toàn bộ nội dung giáo dục được lưu dưới dạng các tệp tin .json hoặc .markdown trong thư mục dự án.

* **Coding-free Content Expansion:** Yêu cầu này được giải quyết triệt để nhờ cấu trúc này. Việc thêm một từ vựng mới chỉ đơn giản là thêm một entry vào file JSON. Không cần chạy câu lệnh SQL INSERT, không cần migration schema.  
* **Hiệu năng:** Do dữ liệu được tải cùng với ứng dụng (hoặc fetch nhẹ nhàng), tốc độ truy xuất gần như tức thì, không có độ trễ mạng khi chuyển câu hỏi, rất phù hợp cho trải nghiệm thi cử hoặc game tốc độ cao.15

#### **3.1.4 Decap CMS (trước đây là Netlify CMS)**

Đây là mảnh ghép quan trọng nhất để trao quyền cho phụ huynh. Decap CMS là một ứng dụng React mã nguồn mở, hoạt động như một lớp giao diện đè lên các file JSON/Git.17

* Nó cung cấp giao diện trực quan (Form nhập liệu) thay vì bắt phụ huynh phải sửa code.  
* Nó xác thực người dùng qua Netlify Identity, đảm bảo chỉ phụ huynh mới có quyền sửa đổi nội dung.17

## ---

**4\. Thiết kế Kiến trúc Hướng Dữ liệu (Data-Driven Design)**

Kiến trúc "Data-Driven" đòi hỏi logic của ứng dụng phải tách biệt hoàn toàn khỏi dữ liệu. Ứng dụng React đóng vai trò là một "cỗ máy" (Engine) xử lý và hiển thị bất kỳ dữ liệu nào được nạp vào, miễn là dữ liệu đó tuân thủ đúng cấu trúc (Schema) đã định nghĩa.

### **4.1 Lược đồ Dữ liệu (JSON Schema) cho Nội dung Học tập**

Việc thiết kế Schema là bước quan trọng nhất để đảm bảo tính linh hoạt. Chúng ta cần định nghĩa các thực thể (Entities) chính.

#### **4.1.1 Thực thể: Vocabulary (Từ vựng)**

Đây là đơn vị dữ liệu nhỏ nhất, phục vụ cho việc học ngôn ngữ và thuật ngữ khoa học/toán học.

JSON

{  
  "id": "voc\_science\_photosynthesis\_01",  
  "term": "Photosynthesis",  
  "definition\_en": "The process by which green plants use sunlight to synthesize nutrients.",  
  "definition\_vi": "Quá trình quang hợp ở cây xanh.",  
  "audio\_src": "/uploads/audio/photosynthesis.mp3",  
  "image\_src": "/uploads/images/photosynthesis\_diagram.png",  
  "subject": "Science",  
  "stage": "Stage 3",  
  "tier": 3,  
  "tags": \["plants", "biology", "life\_processes"\],  
  "related\_terms": \["voc\_science\_chlorophyll\_01", "voc\_science\_sunlight\_01"\]  
}

**Phân tích:**

* Trường definition\_vi hỗ trợ phụ huynh tham gia vào quá trình học của con.  
* Trường tier và tags cho phép hệ thống tự động tạo ra các bài ôn tập theo chủ đề (ví dụ: "Ôn tập tất cả từ vựng Tier 3 chủ đề Plants").3  
* Trường related\_terms tạo ra mạng lưới kiến thức, hỗ trợ các thuật toán gợi ý bài học liên quan.

#### **4.1.2 Thực thể: Curriculum Unit (Đơn vị Bài học)**

Thực thể này ánh xạ trực tiếp với "Tiến độ chương trình trường học" và "Đề cương ôn tập".

JSON

{  
  "id": "unit\_y3\_sci\_term1\_week4",  
  "title": "Living Things and Their Habitats",  
  "start\_date": "2026-09-15",  
  "end\_date": "2026-09-22",  
  "learning\_objectives":,  
  "content\_modules": \[  
    {  
      "type": "vocabulary\_list",  
      "data\_ref": \["voc\_science\_habitat\_01", "voc\_science\_carnivore\_01"\]  
    },  
    {  
      "type": "game\_instance",  
      "game\_id": "game\_sorting\_animals\_01"  
    }  
  \],  
  "periodic\_test\_config": {  
    "enabled": true,  
    "duration\_minutes": 30,  
    "passing\_score": 80  
  }  
}

**Phân tích:**

* start\_date và end\_date cho phép hệ thống hiển thị trạng thái "Đang học", "Sắp tới", hoặc "Đã quá hạn" trên Dashboard của phụ huynh và học sinh.  
* Cấu trúc mảng content\_modules cho phép một bài học chứa nhiều hoạt động khác nhau (học từ vựng, chơi game, làm bài kiểm tra) một cách linh hoạt.

#### **4.1.3 Thực thể: Game Configuration (Cấu hình Trò chơi)**

Để đạt được yêu cầu "Coding-free content expansion", logic game phải được tổng quát hóa. Thay vì viết code cho một game cụ thể, ta viết code cho một *loại* game, và dùng JSON để cấu hình nội dung.16

Ví dụ Schema cho game **"Matching Pairs" (Nối cặp):**

JSON

{  
  "id": "game\_match\_math\_fractions",  
  "engine\_type": "matching\_engine",  
  "difficulty": "medium",  
  "pairs": \[  
    {"left": "1/2", "right": "0.5"},  
    {"left": "1/4", "right": "25%"}  
  \],  
  "settings": {  
    "timer": 60,  
    "show\_feedback\_immediately": true  
  }  
}

Khi React Component \<GameLoader /\> đọc được engine\_type: "matching\_engine", nó sẽ gọi Component \<MatchingGame /\> và truyền dữ liệu pairs vào. Phụ huynh có thể tạo ra hàng trăm game nối cặp khác nhau (Từ \- Nghĩa, Toán \- Kết quả, Hình ảnh \- Tên) chỉ bằng cách tạo file JSON mới qua CMS.19

### **4.2 Chiến lược Lưu trữ Dữ liệu Người dùng (User State)**

Một thách thức của kiến trúc Jamstack tĩnh là không có cơ sở dữ liệu thời gian thực (Real-time DB) phía sau để lưu điểm số. Giải pháp tối ưu cho ngữ cảnh này là **LocalStorage** kết hợp với cơ chế Xuất/Nhập dữ liệu thủ công.21

* **Tại sao LocalStorage?**  
  * **Quyền riêng tư:** Dữ liệu học tập của trẻ em được lưu hoàn toàn trên trình duyệt thiết bị, không gửi về máy chủ, tuân thủ tuyệt đối các quy định bảo mật.  
  * **Tốc độ:** Việc ghi/đọc điểm số diễn ra tức thì, không phụ thuộc vào đường truyền mạng.  
  * **Khả năng hoạt động Offline:** Ứng dụng vẫn hoạt động hoàn hảo khi mất mạng, rất phù hợp với bối cảnh học tập tại nhà không ổn định.  
* **Cấu trúc dữ liệu trong LocalStorage:**  
  JSON  
  "user\_progress": {  
    "completed\_units": \["unit\_y3\_sci\_term1\_week4"\],  
    "quiz\_results": {  
      "quiz\_01": {  
        "score": 9/10,  
        "timestamp": 1704100000,  
        "attempts": 2  
      }  
    },  
    "streaks": {  
      "current\_streak": 5,  
      "last\_login": "2026-01-02"  
    }  
  }

* **Cơ chế Sao lưu:** Để phòng trường hợp mất thiết bị hoặc xóa cache trình duyệt, hệ thống cung cấp nút "Sao lưu Tiến độ" trên Dashboard phụ huynh. Chức năng này sẽ gom toàn bộ dữ liệu LocalStorage thành một file JSON mã hóa để phụ huynh tải về và lưu trữ (hoặc đồng bộ qua Google Drive nếu mở rộng sau này).

## ---

**5\. Quy trình Quản lý Nội dung và Vai trò Phụ huynh**

Hệ thống được thiết kế để trao quyền tối đa cho phụ huynh thông qua Decap CMS, biến họ thành những "Kiến trúc sư nội dung" mà không cần kỹ năng lập trình.

### **5.1 Cấu hình Decap CMS (config.yml)**

Để hiện thực hóa việc nhập liệu, file cấu hình của Decap CMS cần được thiết lập tỉ mỉ để ánh xạ với JSON Schema.

#### **5.1.1 Cấu hình Collection "Mục tiêu & Đề cương"**

Yêu cầu "Phụ huynh nhập liệu mục tiêu và đề cương ôn tập" được xử lý thông qua một Collection chuyên biệt.

YAML

collections:  
  \- name: "goals"  
    label: "Mục tiêu & Đề cương"  
    folder: "src/data/goals"  
    create: true  
    fields:  
      \- {label: "Tuần học", name: "week", widget: "string"}  
      \- {label: "Mục tiêu chính", name: "objectives", widget: "list"}  
      \- {label: "Ghi chú từ Giáo viên", name: "teacher\_notes", widget: "text"}  
      \- {label: "Bài kiểm tra sắp tới", name: "upcoming\_test", widget: "boolean", default: false}

#### **5.1.2 Widget Quan hệ (Relation Widget)**

Sức mạnh của hệ thống nằm ở khả năng liên kết dữ liệu. Sử dụng relation widget của Decap CMS để kết nối "Unit" với "Vocabulary".23

* Phụ huynh khi tạo một Unit mới (ví dụ: "Plants") sẽ thấy một danh sách thả xuống (Dropdown) chứa toàn bộ từ vựng trong hệ thống.  
* Họ có thể tìm kiếm và chọn nhiều từ vựng để gán vào Unit này.  
* Cấu hình:  
  YAML  
  \- {  
      label: "Từ vựng liên quan",  
      name: "vocab\_ids",  
      widget: "relation",  
      collection: "vocabulary",  
      search\_fields: \["term", "definition\_vi"\],  
      value\_field: "id",  
      multiple: true  
    }

  Điều này tạo ra một trải nghiệm quản lý nội dung chuyên nghiệp, nơi dữ liệu được tái sử dụng thay vì nhập đi nhập lại.

### **5.2 Xử lý Bài Kiểm tra Định kỳ (Periodic Tests)**

Yêu cầu về "Cập nhật tiến độ bài kiểm tra định kỳ" đòi hỏi một chế độ đặc biệt trong ứng dụng: **Exam Mode**.

* **Thiết lập trong CMS:** Phụ huynh tạo một entry mới trong collection tests. Entry này chứa danh sách các câu hỏi (trỏ tới ID câu hỏi hoặc nhập trực tiếp), thời gian làm bài (ví dụ: 45 phút), và trọng số điểm.  
* **Logic Frontend:**  
  * Khi học sinh bắt đầu bài kiểm tra, React kích hoạt bộ đếm ngược (Countdown Timer).  
  * Tắt toàn bộ tính năng gợi ý (Hints) và phản hồi tức thì (Feedback).  
  * Chỉ khi nộp bài hoặc hết giờ, hệ thống mới tính điểm và lưu kết quả vào LocalStorage dưới dạng summative\_assessment.  
* **Báo cáo:** Dashboard phụ huynh sẽ tách biệt điểm số "Luyện tập" (Formative) và điểm số "Kiểm tra" (Summative) để phụ huynh có cái nhìn rõ ràng về năng lực thực tế của con.

## ---

**6\. Quy trình AI: Chuyển đổi Đề cương thành Dữ liệu (AI Pipeline)**

Đây là tính năng đột phá giúp giải phóng sức lao động cho phụ huynh. Thay vì nhập tay hàng chục từ vựng, phụ huynh sử dụng AI để tự động hóa quy trình.

### **6.1 Vấn đề Dữ liệu Phi cấu trúc**

Phụ huynh thường nhận được đề cương dưới dạng:

* Email từ giáo viên: *"Dear Parents, next week we study Light. Words: transparent, opaque, shadow..."*  
* File PDF/Word bài tập về nhà.  
* Ảnh chụp phiếu bài tập.

Các định dạng này là "phi cấu trúc" và không thể đưa trực tiếp vào ứng dụng React.

### **6.2 Giải pháp AI Pipeline**

Quy trình sử dụng các Mô hình Ngôn ngữ Lớn (LLM) như GPT-4 hoặc Claude để đóng vai trò "Bộ chuyển đổi dữ liệu" (Data Converter).

#### **6.2.1 Kỹ thuật Prompt Engineering (Kỹ thuật Ra lệnh)**

Để đảm bảo AI sinh ra dữ liệu JSON chính xác khớp với Schema của hệ thống, chúng ta cần sử dụng kỹ thuật "System Prompting" và "Few-Shot Learning" (Học qua ví dụ).24

**Mẫu Prompt (Template) dành cho Phụ huynh:**

Vai trò: Bạn là một Chuyên gia Dữ liệu Giáo dục cho hệ thống Cambridge Primary.  
Nhiệm vụ: Chuyển đổi văn bản đề cương dưới đây thành định dạng JSON hợp lệ.  
Yêu cầu:

1. Trích xuất tất cả từ vựng và khái niệm quan trọng.  
2. Tạo định nghĩa tiếng Anh đơn giản (phù hợp trẻ 7-10 tuổi).  
3. Dịch nghĩa sang tiếng Việt chính xác theo ngữ cảnh Toán/Khoa học.  
4. Phân loại Tier (1, 2, 3\) cho từ vựng.  
5. Output CHỈ LÀ JSON thô, không có markdown, tuân thủ cấu trúc sau:  
   \`\`

**Văn bản đầu vào:**

#### **6.2.2 Xử lý PDF và Hình ảnh (MinerU & Multimodal LLM)**

Với file PDF hoặc ảnh chụp, quy trình phức tạp hơn một chút.

* **Công cụ:** Sử dụng các công cụ mã nguồn mở như MinerU hoặc các dịch vụ AI Multimodal (đa phương thức) có khả năng đọc tài liệu.27  
* **Workflow:**  
  1. Phụ huynh chụp ảnh đề cương/bài kiểm tra.  
  2. Tải ảnh lên công cụ AI (hoặc qua API tích hợp trong Dashboard quản lý nếu có điều kiện phát triển backend serverless).  
  3. AI nhận diện cấu trúc câu hỏi (Trắc nghiệm, Nối từ, Điền khuyết).  
  4. AI chuyển đổi thành JSON tương ứng với Schema của Game Configuration.  
  5. Phụ huynh copy đoạn JSON này và dán vào trường "Import JSON" trong Decap CMS.

#### **6.2.3 Widget "Raw JSON Editor" trong CMS**

Trong Decap CMS, cần tích hợp một widget cho phép paste JSON trực tiếp. Widget này nên có tính năng "Validate" (Kiểm tra lỗi cú pháp) trước khi lưu để tránh làm hỏng ứng dụng.29

## ---

**7\. Chi tiết Triển khai Frontend với ReactJS**

Phần Frontend là nơi hội tụ của tất cả các luồng dữ liệu và logic trên, trực tiếp phục vụ trải nghiệm học tập.

### **7.1 Cấu trúc Component và Tái sử dụng (Reusability)**

Cấu trúc thư mục dự án React nên được tổ chức theo tính năng (Feature-based) để dễ bảo trì.10

src/  
components/  
GameEngine/  
GameLoader.jsx (Component điều phối, đọc JSON để quyết định load game nào)  
MatchingGame/ (Game nối cặp)  
Card.jsx  
Board.jsx  
DragDropSorting/ (Game phân loại \- Dùng react-dnd)  
Bucket.jsx  
DraggableItem.jsx  
Dashboard/  
ProgressChart.jsx (Biểu đồ Recharts)  
GoalSetter.jsx (Form đặt mục tiêu)  
Shared/  
TTSButton.jsx (Nút phát âm \- Dùng react-speech-kit)  
hooks/  
useCurriculumData.js (Hook custom để fetch JSON từ folder content)  
useLocalStorage.js (Hook quản lý lưu trữ tiến độ)

### **7.2 Generic Game Engine (Động cơ Game Tổng quát)**

Điểm sáng tạo của kiến trúc này là GameLoader. Component này nhận vào một unitId, tìm file JSON tương ứng, và render giao diện.

JavaScript

// Minh họa logic của GameLoader  
const GameLoader \= ({ unitData }) \=\> {  
  const { gameType, gameConfig } \= unitData;

  switch (gameType) {  
    case 'matching':  
      // Sử dụng Generic Component MatchingGame  
      // Truyền dữ liệu cấu hình (pairs, timer) vào qua props  
      return \<MatchingGame config\={gameConfig} /\>;  
      
    case 'sorting':  
      // Sử dụng Generic Component SortingGame  
      // Truyền dữ liệu phân loại (buckets, items) vào qua props  
      return \<SortingGame config\={gameConfig} /\>;

    case 'quiz':  
      // Sử dụng Generic Component QuizEngine  
      // Truyền danh sách câu hỏi vào  
      return \<QuizEngine config\={gameConfig} /\>;  
        
    default:  
      return \<div\>Game type not supported\</div\>;  
  }  
};

Mô hình này sử dụng **Generics** trong React (nếu dùng TypeScript) hoặc Props linh hoạt để đảm bảo một component Code có thể phục vụ vô hạn nội dung Data.20

### **7.3 Tích hợp Text-to-Speech (TTS) cho ESL**

Học sinh Cambridge cần nghe phát âm chuẩn. Thư viện react-speech-kit cho phép truy cập Web Speech API của trình duyệt.31

* **Ưu điểm:** Không cần file MP3 nặng nề cho mọi từ vựng (giảm dung lượng tải trang). Hoạt động offline.  
* **Triển khai:** Tạo component \<TTSButton text={term} lang="en-GB" /\>. Khi click, nó gọi hàm speak({ text, voice: googleUKFemale }). Điều này đặc biệt hữu ích cho các từ vựng khoa học khó đọc.

## ---

**8\. Bảng Tổng hợp So sánh Tính năng và Giải pháp Kỹ thuật**

Để tóm tắt kiến trúc đề xuất, bảng dưới đây ánh xạ trực tiếp các yêu cầu của người dùng với giải pháp kỹ thuật cụ thể.

| Yêu cầu Người dùng | Giải pháp Kiến trúc & Công nghệ | Cơ chế Hoạt động (Mechanism) |
| :---- | :---- | :---- |
| **(1) Cập nhật tiến độ & Bài kiểm tra định kỳ** | **JSON Schema (Units/Tests)** \+ **LocalStorage** | Dữ liệu bài học được cấu trúc theo tuần/tháng trong JSON. Trạng thái hoàn thành và điểm số bài kiểm tra được lưu cục bộ trên trình duyệt để bảo mật và tốc độ. |
| **(2) Phụ huynh nhập liệu mục tiêu & đề cương** | **Decap CMS** (Goals Collection) | Giao diện quản trị trực quan cho phép phụ huynh điền form. Dữ liệu được commit lên Git và build tự động. Dashboard hiển thị mục tiêu này cho học sinh. |
| **(3) Data-Driven / Coding-free expansion** | **Generic React Components** \+ **Git-based JSON** | Mã nguồn React được viết dưới dạng "Engine" tổng quát. Nội dung cụ thể (từ vựng, luật game) được nạp từ file JSON bên ngoài. Thêm nội dung \= Thêm file JSON, không sửa code. |
| **(4) Quy trình AI chuyển đổi đề cương** | **LLM Prompt Engineering** \+ **JSON Import** | Sử dụng Prompt mẫu để biến văn bản giáo viên thành JSON đúng chuẩn Schema. Quy trình Copy-Paste đơn giản vào CMS hoặc tích hợp tool tự động hóa. |
| **Hỗ trợ Cambridge/CLIL** | **Metadata Tagging** \+ **TTS API** | Gắn thẻ từ vựng theo Tier/Topic/Stage. Tích hợp Text-to-Speech để hỗ trợ phát âm (Communication). |

## ---

**9\. Kết luận và Khuyến nghị Triển khai**

Báo cáo này khẳng định tính khả thi và ưu việt của việc sử dụng kiến trúc Jamstack (React \+ JSON \+ Netlify) cho một ứng dụng giáo dục gia đình chuyên biệt. Giải pháp này đáp ứng hoàn hảo nhu cầu quản lý linh hoạt của phụ huynh và trải nghiệm học tập tương tác của học sinh Cambridge.

**Khuyến nghị lộ trình triển khai:**

1. **Giai đoạn 1 (Cốt lõi):** Thiết lập Repository Git, cài đặt React và Netlify. Xây dựng Schema JSON cơ bản cho Từ vựng và Unit. Cấu hình Decap CMS.  
2. **Giai đoạn 2 (Game Engine):** Phát triển các component React cơ bản (MatchingGame, Quiz). Tích hợp LocalStorage để lưu điểm.  
3. **Giai đoạn 3 (Quy trình AI):** Xây dựng bộ Prompt chuẩn cho ChatGPT/Claude để hỗ trợ phụ huynh chuyển đổi nội dung. Viết tài liệu hướng dẫn phụ huynh cách lấy nội dung từ email/PDF.  
4. **Giai đoạn 4 (Nâng cao):** Tích hợp chế độ "Exam Mode" (Bài kiểm tra định kỳ) và Dashboard phân tích dữ liệu chuyên sâu (Biểu đồ tiến độ, so sánh với mục tiêu).

Mô hình này không chỉ giải quyết bài toán hiện tại mà còn tạo ra nền tảng bền vững, cho phép kho học liệu của học sinh "lớn lên" cùng với trình độ của các em qua từng năm học, hoàn toàn nằm trong sự kiểm soát dữ liệu của gia đình.

#### **Works cited**

1. Teaching Maths through English – a CLIL approach, accessed January 2, 2026, [https://www.cambridgeenglish.org/Images/168751-teaching-maths-through-english-a-clil-approach.pdf](https://www.cambridgeenglish.org/Images/168751-teaching-maths-through-english-a-clil-approach.pdf)  
2. Resource List For Cambridge Primary, accessed January 2, 2026, [https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-primary/resource-list/](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-primary/resource-list/)  
3. Science Vocabulary Progression Map \- Florence Melly Community Primary School, accessed January 2, 2026, [https://florencemelly.org/wp-content/uploads/2024/05/Science-Vocabulary-Progression.pdf](https://florencemelly.org/wp-content/uploads/2024/05/Science-Vocabulary-Progression.pdf)  
4. Year 3 Vocabulary List Science Plants Animals including humans Light Rocks Forces and magnets \- Treeton C of E Primary School \-, accessed January 2, 2026, [https://www.treetoncofe.co.uk/assets/year-3-vocabulary-list-science.pdf](https://www.treetoncofe.co.uk/assets/year-3-vocabulary-list-science.pdf)  
5. Science vocabulary for english language learners \- Cambridge University Press, accessed January 2, 2026, [https://www.cambridge.org/us/education/blog/2019/08/29/unlocking-science-english-language-learners-part-three/](https://www.cambridge.org/us/education/blog/2019/08/29/unlocking-science-english-language-learners-part-three/)  
6. Making progress with scientific vocabulary Year 3 Working Scientifically Plants Animals including Humans Rocks Light Forces and \- Condover C of E Primary School, accessed January 2, 2026, [https://www.condoverschool.co.uk/\_site/data/files/migrated/science/making-progress-with-scientific-vocabulary-y3.pdf](https://www.condoverschool.co.uk/_site/data/files/migrated/science/making-progress-with-scientific-vocabulary-y3.pdf)  
7. Essential Science Primary 3 Teacher's Guide \- Cambridge University Press & Assessment, accessed January 2, 2026, [https://www.cambridge.org/gh/files/8816/3939/2469/9789988897536AR.pdf](https://www.cambridge.org/gh/files/8816/3939/2469/9789988897536AR.pdf)  
8. Make your app speak with React-Speech-kit \- OpenReplay Blog, accessed January 2, 2026, [https://blog.openreplay.com/make-your-app-speak-with-react-speech-kit/](https://blog.openreplay.com/make-your-app-speak-with-react-speech-kit/)  
9. Architecture | Decap CMS | Open-Source Content Management System, accessed January 2, 2026, [https://decapcms.org/docs/architecture/](https://decapcms.org/docs/architecture/)  
10. Best Practices and Design Patterns in React.js for High-Quality Applications \- Medium, accessed January 2, 2026, [https://medium.com/@obrm770/best-practices-and-design-patterns-in-react-js-for-high-quality-applications-6b203be747fb](https://medium.com/@obrm770/best-practices-and-design-patterns-in-react-js-for-high-quality-applications-6b203be747fb)  
11. The Joy of React, accessed January 2, 2026, [https://www.joyofreact.com/](https://www.joyofreact.com/)  
12. Tutorial: Tic-Tac-Toe \- React, accessed January 2, 2026, [https://react.dev/learn/tutorial-tic-tac-toe](https://react.dev/learn/tutorial-tic-tac-toe)  
13. React on Netlify, accessed January 2, 2026, [https://docs.netlify.com/build/frameworks/framework-setup-guides/react/](https://docs.netlify.com/build/frameworks/framework-setup-guides/react/)  
14. Deploying React apps to Netlify: 3 methods \- LogRocket Blog, accessed January 2, 2026, [https://blog.logrocket.com/deploy-react-apps-netlify-3-ways/](https://blog.logrocket.com/deploy-react-apps-netlify-3-ways/)  
15. Basic Steps | Decap CMS | Open-Source Content Management System, accessed January 2, 2026, [https://decapcms.org/docs/basic-steps/](https://decapcms.org/docs/basic-steps/)  
16. \[Share\] Data-Driven Design: Leveraging Lessons from Game Development in Everyday Software \- DEV Community, accessed January 2, 2026, [https://dev.to/methodox/data-driven-design-leveraging-lessons-from-game-development-in-everyday-software-5512](https://dev.to/methodox/data-driven-design-leveraging-lessons-from-game-development-in-everyday-software-5512)  
17. Overview | Decap CMS | Open-Source Content Management System, accessed January 2, 2026, [https://decapcms.org/docs/intro/](https://decapcms.org/docs/intro/)  
18. CHI 2018 Workshop: Data-Driven Educational Game Design, accessed January 2, 2026, [https://www.cs.cmu.edu/\~bmclaren/pubs/McLarenAsbell-ClarkeHammer-DataDrivenEdGameDesign-CHI2018workshop.pdf](https://www.cs.cmu.edu/~bmclaren/pubs/McLarenAsbell-ClarkeHammer-DataDrivenEdGameDesign-CHI2018workshop.pdf)  
19. How to Use React.js to Build Interactive Games \- DEV Community, accessed January 2, 2026, [https://dev.to/srdan\_borovi\_584c6b1d773/how-to-use-reactjs-to-build-interactive-games-537j](https://dev.to/srdan_borovi_584c6b1d773/how-to-use-reactjs-to-build-interactive-games-537j)  
20. Good way to render components that come as JSON from the backend? : r/reactjs \- Reddit, accessed January 2, 2026, [https://www.reddit.com/r/reactjs/comments/16ed4fv/good\_way\_to\_render\_components\_that\_come\_as\_json/](https://www.reddit.com/r/reactjs/comments/16ed4fv/good_way_to_render_components_that_come_as_json/)  
21. Is there a way to persist state in react without using localStorage? \- Reddit, accessed January 2, 2026, [https://www.reddit.com/r/react/comments/1j6wmt8/is\_there\_a\_way\_to\_persist\_state\_in\_react\_without/](https://www.reddit.com/r/react/comments/1j6wmt8/is_there_a_way_to_persist_state_in_react_without/)  
22. Unlocking the Power of Local Storage in React: A Comparative Analysis with Cookies, accessed January 2, 2026, [https://dev.to/khaled17/unlocking-the-power-of-local-storage-in-react-a-comparative-analysis-with-cookies-1o7g](https://dev.to/khaled17/unlocking-the-power-of-local-storage-in-react-a-comparative-analysis-with-cookies-1o7g)  
23. Widgets | Decap CMS | Open-Source Content Management System, accessed January 2, 2026, [https://decapcms.org/docs/widgets/](https://decapcms.org/docs/widgets/)  
24. JSON prompting for LLMs \- IBM Developer, accessed January 2, 2026, [https://developer.ibm.com/articles/json-prompting-llms/](https://developer.ibm.com/articles/json-prompting-llms/)  
25. Simplify Information Extraction: A Reusable Prompt Template for GPT Models, accessed January 2, 2026, [https://towardsdatascience.com/simplify-information-extraction-a-reusable-prompt-template-for-gpt-models-d6d5f1bd25a0/](https://towardsdatascience.com/simplify-information-extraction-a-reusable-prompt-template-for-gpt-models-d6d5f1bd25a0/)  
26. Effective Prompt Engineering for Data Extraction with Large Language Models | by DanShw, accessed January 2, 2026, [https://medium.com/@kofsitho/effective-prompt-engineering-for-data-extraction-with-large-language-models-331ee454cbae](https://medium.com/@kofsitho/effective-prompt-engineering-for-data-extraction-with-large-language-models-331ee454cbae)  
27. opendatalab/MinerU: Transforms complex documents like PDFs into LLM-ready markdown/JSON for your Agentic workflows. \- GitHub, accessed January 2, 2026, [https://github.com/opendatalab/MinerU](https://github.com/opendatalab/MinerU)  
28. ePub-to-Quiz Conversion with Large Language Models \- Institut für Computerlinguistik \- Universität Zürich, accessed January 2, 2026, [https://www.cl.uzh.ch/dam/jcr:5c3787db-bc0f-42a6-82ab-92fbc435585e/masterarbeit.final.pdf](https://www.cl.uzh.ch/dam/jcr:5c3787db-bc0f-42a6-82ab-92fbc435585e/masterarbeit.final.pdf)  
29. Introducing JSON Schemas for AI Data Integrity \- DEV Community, accessed January 2, 2026, [https://dev.to/stephenc222/introducing-json-schemas-for-ai-data-integrity-611](https://dev.to/stephenc222/introducing-json-schemas-for-ai-data-integrity-611)  
30. Use generics in React to make dynamic and flexible components | Total TypeScript, accessed January 2, 2026, [https://www.totaltypescript.com/tips/use-generics-in-react-to-make-dynamic-and-flexible-components](https://www.totaltypescript.com/tips/use-generics-in-react-to-make-dynamic-and-flexible-components)  
31. react-speech-kit | Demo, accessed January 2, 2026, [https://mikeyparton.github.io/react-speech-kit/](https://mikeyparton.github.io/react-speech-kit/)  
32. SpeechSynthesis \- Web APIs | MDN, accessed January 2, 2026, [https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)