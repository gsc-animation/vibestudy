# **Báo cáo Kiến trúc Sư phạm và Kỹ thuật: Hệ thống EdTech Tích hợp cho Giáo dục Tại nhà (Homeschooling) theo Chương trình Cambridge Stage 3**

## **Tóm tắt Điều hành**

Báo cáo này trình bày một bản thiết kế toàn diện và chi tiết cho việc xây dựng một hệ sinh thái phần mềm hỗ trợ giáo dục tại nhà, được tùy biến đặc biệt cho học sinh Lớp 3 (độ tuổi 8-9) theo chương trình Cambridge Primary. Dựa trên yêu cầu tích hợp ba môn học cốt lõi—Toán học, Khoa học Tự nhiên (Natural Science) và Tiếng Anh (ESL)—hệ thống được thiết kế dựa trên sự tổng hòa của hai triết lý giáo dục tiên tiến là **CPA (Cụ thể \- Hình ảnh \- Trừu tượng)** và **CLIL (Học tích hợp Nội dung và Ngôn ngữ)**, được vận hành bởi khung quản lý dự án linh hoạt **Agile/Scrum** (cụ thể là mô hình eduScrum).

Nghiên cứu sâu rộng về đặc thù của chương trình Cambridge Stage 3 cho thấy một cơ hội duy nhất để biến các rào cản ngôn ngữ thành động lực học tập thông qua việc "số hóa" các trải nghiệm khoa học thực nghiệm. Báo cáo này xác định rằng việc tách rời việc học ngôn ngữ khỏi việc học nội dung khoa học là không hiệu quả đối với học sinh ESL ở độ tuổi này. Thay vào đó, kiến trúc phần mềm đề xuất đặt Khoa học làm "miền nội dung" (content domain) chính để thực hành ngôn ngữ, trong khi các quy trình Agile đóng vai trò là "khung siêu nhận thức" (metacognitive framework) giúp học sinh phát triển kỹ năng tự học.

Các phát hiện chính từ dữ liệu nghiên cứu bao gồm việc xác định mối tương quan trực tiếp giữa kỹ năng **"Tư duy và Làm việc Khoa học" (Thinking and Working Scientifically \- TWS)** của Cambridge với quy trình **Retrospective (Hồi quy)** trong Agile. Hệ thống phần mềm được đề xuất không chỉ là một kho chứa bài học, mà là một môi trường **VRA (Virtual-Representational-Abstract)**—một sự tiến hóa kỹ thuật số của CPA—nơi các khái niệm trừu tượng như "lực ma sát" hay "quang hợp" được hữu hình hóa thông qua các mô phỏng vật lý tương tác, đồng thời được hỗ trợ bởi các thuật toán AI để "bắc giàn giáo" (scaffolding) cho ngôn ngữ.

## ---

**1\. Cơ sở Lý luận và Phân tích Khung Chương trình**

Để xây dựng một phần mềm giáo dục hiệu quả, bước đầu tiên và quan trọng nhất là giải mã cấu trúc sư phạm của chương trình Cambridge và các cơ chế nhận thức sẽ thúc đẩy quá trình học tập của trẻ. Đối với học sinh Lớp 3, đặc biệt là trong bối cảnh ESL, phần mềm phải đóng vai trò là người hướng dẫn, người phiên dịch và người quản lý quy trình.

### **1.1. Hệ sinh thái Khoa học Cambridge Tiểu học (Stage 3): Động cơ Truy vấn**

Chương trình Khoa học Cambridge Tiểu học (Cambridge Primary Science) không đơn thuần là việc tích lũy các sự kiện khoa học rời rạc; đó là một khung năng lực được thiết kế chặt chẽ để phát triển tư duy truy vấn. Đối với Stage 3, chương trình được cấu trúc thành các mạch nội dung (Strands) cụ thể và một mạch kỹ năng xuyên suốt là **Tư duy và Làm việc Khoa học (Thinking and Working Scientifically \- TWS)**.1

#### **1.1.1. Mạch "Tư duy và Làm việc Khoa học" (TWS)**

TWS là yếu tố then chốt phân biệt giữa một phần mềm "đọc sách giáo khoa điện tử" và một hệ thống học tập thực thụ. Nghiên cứu chỉ ra rằng ở Stage 3, học sinh phải chuyển dịch từ việc quan sát thụ động sang tham gia chủ động vào phương pháp khoa học. Các yêu cầu cụ thể bao gồm:

* **Dự đoán (Prediction):** Học sinh phải "đưa ra dự đoán mô tả một số kết quả có thể xảy ra của một cuộc truy vấn".1 Điều này đòi hỏi phần mềm phải có tính năng "Chặn quy trình" (Process Blocking)—nghĩa là hệ thống không cho phép học sinh xem kết quả thí nghiệm cho đến khi họ đã nhập hoặc chọn một dự đoán.  
* **Quan sát và Đo lường (Observation & Measurement):** Học sinh cần "xác định các mẫu hình đơn giản trong kết quả" và "thu thập, ghi lại các quan sát".3 Đối với phần mềm, điều này ám chỉ sự cần thiết của các công cụ ghi chép dữ liệu kỹ thuật số (Digital Data Logging)—như các bảng biểu tương tác, biểu đồ đơn giản tự động vẽ khi nhập số liệu, và các khung canvas để vẽ lại mẫu vật.  
* **Kết luận (Conclusion):** Học sinh phải "rút ra kết luận từ kết quả và bắt đầu sử dụng kiến thức khoa học để đề xuất các giải thích".3 Đây là nơi ngôn ngữ và khoa học giao thoa mạnh mẽ nhất, đòi hỏi sự hỗ trợ của các cấu trúc câu mẫu (sentence frames).

**Hàm ý cho Phần mềm:** Hệ thống cần tích hợp một module **"Sổ tay Phòng thí nghiệm Kỹ thuật số" (Digital Lab Notebook)** tồn tại xuyên suốt các bài học. Sổ tay này không chỉ là nơi ghi chép, mà là một công cụ tương tác buộc học sinh phải đi qua quy trình: *Dự đoán \-\> Thí nghiệm \-\> Ghi dữ liệu \-\> Kết luận*.

#### **1.1.2. Các Mạch Nội dung và Đặc thù Xử lý**

Nội dung của Stage 3 cung cấp "nguyên liệu thô" cho các tính năng mô phỏng của phần mềm 5:

| Mạch Nội dung | Yêu cầu Kiến thức Stage 3 | Chiến lược Xử lý trên Phần mềm (CPA/VRA) |
| :---- | :---- | :---- |
| **Sinh học (Biology)** | "Quy trình sống" (cây cần ánh sáng/nước), các cơ quan nội tạng người (não, tim, dạ dày, phổi, ruột).1 | **Thực tế Tăng cường (AR) / Mô hình Lớp:** Vì không thể mổ xẻ cơ thể người thực, phần mềm cần sử dụng mô hình 3D phân lớp. Học sinh dùng thanh trượt để làm "trong suốt" da, cơ, xương để lộ nội tạng. |
| **Hóa học (Chemistry)** | "Chất rắn và Chất lỏng" (tính chất, độ nhớt, thay đổi hình dạng).1 | **Mô phỏng Hạt (Particle Simulation):** Sử dụng các engine vật lý để mô phỏng cách chất lỏng chảy hoặc cách chất rắn giữ nguyên hình dạng khi bị di chuyển vào các vật chứa khác nhau. |
| **Vật lý (Physics)** | "Lực và Nam châm" (ma sát, cực từ, hút/đẩy).7 | **Phòng Lab Ảo (Virtual Lab):** Đây là khu vực lý tưởng nhất cho tương tác. Học sinh có thể thay đổi bề mặt (nhám/trơn) để xem xe chạy xa bao nhiêu, hoặc kéo thả nam châm để thấy lực hút vô hình được hiển thị bằng vector. |
| **Trái đất & Vũ trụ** | "Trái đất, Mặt trăng, Mặt trời" (chuyển động, ngày/đêm). | **Mô hình Quỹ đạo Tương tác:** Cho phép học sinh "tua nhanh" thời gian để quan sát sự thay đổi bóng nắng (shadow) trong ngày. |

### **1.2. Hệ sinh thái Cambridge Global English (Stage 3): Động cơ Ngôn ngữ**

Đối với học sinh ESL, Cambridge Global English Stage 3 (tương đương CEFR A1/A2) chuyển trọng tâm từ từ vựng cơ bản sang khả năng sử dụng ngôn ngữ chức năng (functional fluency). Điểm mấu chốt là ở giai đoạn này, học sinh bắt đầu sử dụng tiếng Anh để học các môn khác (English for academic purposes), điều này hoàn toàn phù hợp với triết lý CLIL.

#### **1.2.1. Yêu cầu về Ngữ pháp và Cấu trúc**

Phần mềm phải được lập trình để nhận diện và khuyến khích các cấu trúc ngữ pháp cụ thể của Stage 3, đặc biệt là những cấu trúc hỗ trợ tư duy khoa học:

* **Từ nối (Connectives):** Việc sử dụng "because" (bởi vì) để đưa ra lý do 9 là cực kỳ quan trọng trong việc viết kết luận khoa học (Ví dụ: "The magnet pulled the clip *because* it is made of iron").  
* **Trạng từ chỉ cách thức (Adverbs of Manner):** Các từ như *slowly, quickly, carefully* 9 là cần thiết để mô tả quá trình thực hiện thí nghiệm.  
* **Động từ mệnh lệnh (Command Verbs):** *Predict, measure, observe, compare*.10 Đây không chỉ là từ vựng, mà phải là các nhãn (labels) trên giao diện người dùng (UI) để học sinh quen thuộc với việc điều hướng bằng tiếng Anh.

#### **1.2.2. Phân tầng Từ vựng (Vocabulary Tiers)**

Một trong những thách thức lớn nhất của học sinh ESL khi học Khoa học là sự quá tải từ vựng. Phần mềm cần phân loại và xử lý từ vựng theo mô hình ba tầng 6:

* **Tier 1 (Cơ bản):** *Hot, cold, push, pull, run.* (Từ vựng giao tiếp hàng ngày, thường đã biết).  
* **Tier 2 (Học thuật liên môn):** *Observe, compare, predict, accurate, conclusion, separate.* (Từ vựng học thuật cần thiết cho việc học, cần được giải thích rõ ràng).  
* **Tier 3 (Chuyên ngành):** *Photosynthesis, permeable, magnetic, friction, gravity, ovary.* (Từ vựng kỹ thuật, cần định nghĩa chính xác và hình ảnh minh họa).

**Chiến lược Phần mềm:** Tính năng "Từ điển" không thể chỉ là một danh sách phẳng. Nó phải là một **Glossary Ngữ cảnh hóa (Context-Aware Glossary)**. Khi học sinh gặp từ "Friction" trong bài Vật lý, từ này phải được làm nổi bật (highlight). Khi nhấp vào, học sinh không chỉ thấy định nghĩa mà còn thấy một đoạn video ngắn (loop) về hai vật cọ xát vào nhau, cùng với phát âm chuẩn.11

### **1.3. Giao điểm CLIL: Tích hợp Nội dung và Ngôn ngữ**

Triết lý bao trùm cho việc kết hợp các môn học này là CLIL. Theo Coyle, một bài học CLIL thành công phải đảm bảo 4 yếu tố (4Cs).12 Phần mềm cần được thiết kế để đảm bảo 4Cs này luôn hiện diện:

1. **Content (Nội dung):** Kiến thức khoa học (Ví dụ: Nam châm).  
2. **Communication (Giao tiếp):** Ngôn ngữ cần thiết để nói về nội dung (Ví dụ: "The north pole *repels* the north pole"). Phần mềm cần cung cấp các mẫu câu để học sinh thực hành.  
3. **Cognition (Nhận thức):** Các kỹ năng tư duy (Ví dụ: Phân loại vật liệu thành từ tính và phi từ tính). Các bài tập kéo-thả (drag-and-drop) phân loại là tính năng bắt buộc.  
4. **Culture (Văn hóa):** Bối cảnh thực tế (Ví dụ: Tàu đệm từ Maglev ở Nhật Bản/Trung Quốc hoạt động như thế nào?). Phần mềm cần có các mục "Did you know?" (Bạn có biết?) liên kết bài học với thế giới thực.12

## ---

**2\. Mô hình CPA trong Môi trường Kỹ thuật số: Từ Cụ thể đến Trừu tượng Ảo (VRA)**

Phương pháp **Concrete-Pictorial-Abstract (CPA)**, vốn nổi tiếng trong Toán học Singapore, cũng đóng vai trò sống còn trong Khoa học. Thách thức đặt ra là làm thế nào để tái tạo giai đoạn "Cụ thể" (Concrete) \- vốn dĩ là cầm nắm vật thật \- trong một phần mềm máy tính.

### **2.1. Tái định nghĩa "Cụ thể" (Concrete) cho Phần mềm: Khung VRA**

Nghiên cứu hiện đại 14 đề xuất sự chuyển dịch từ CPA sang **VRA (Virtual-Representational-Abstract)**. Các thao tác ảo (Virtual Manipulatives) được chứng minh là có hiệu quả tương đương, thậm chí cao hơn vật lý thực trong một số trường hợp nhờ khả năng hiển thị các yếu tố vô hình (như lực, dòng điện).

| Giai đoạn CPA | Lớp học Truyền thống | Triển khai trên Phần mềm (VRA) |
| :---- | :---- | :---- |
| **Cụ thể (Concrete) \-\> Ảo (Virtual)** | Học sinh cầm hai thanh nam châm thật, cảm nhận lực đẩy khi đưa hai cực cùng tên lại gần nhau. | **Mô phỏng Vật lý (Physics Engine Simulations):** Học sinh dùng chuột/cảm ứng kéo hai nam châm ảo lại gần nhau. Khi hai cực Bắc gặp nhau, nam châm ảo sẽ tự động "bật" ra xa (visual recoil) và phát ra âm thanh phản hồi. Học sinh cảm nhận được "lực" thông qua phản hồi thị giác tức thì. |
| **Hình ảnh (Pictorial) \-\> Biểu diễn (Representational)** | Học sinh vẽ lại thí nghiệm vào vở, vẽ các mũi tên chỉ lực. | **Sơ đồ Tương tác (Interactive Diagramming):** Sau khi mô phỏng, phần mềm phủ một lớp (overlay) lên màn hình. Học sinh kéo các mũi tên vector đè lên vị trí nam châm để biểu diễn lực. Các mũi tên này tự động điều chỉnh độ dài theo độ lớn của lực trong mô phỏng. |
| **Trừu tượng (Abstract)** | Học sinh viết kết luận: "Cực cùng tên đẩy nhau." | **Bài tập Cloze & Xây dựng Phương trình:** Học sinh kéo các khối từ vựng (Word Blocks) vào câu: "\[North\] and \[North\] will". Đây là bước chuyển dịch sang ngôn ngữ học thuật. |

### **2.2. Ứng dụng VRA vào các Module Khoa học Cụ thể**

#### **2.2.1. Nghiên cứu tình huống: Lực và Ma sát (Vật lý Stage 3\)**

* **Virtual Concrete:** Học sinh vào "Phòng Lab Ảo". Có một đoạn đường dốc và một chiếc xe đồ chơi. Học sinh có thể thay đổi "Vật liệu lát đường" (Đá, Cát, Thảm). Khi bấm "Go", xe chạy xuống dốc. Engine vật lý tính toán và hiển thị xe chạy chậm lại trên cát và dừng sớm.7  
* **Pictorial:** Ngay tại vị trí xe dừng, một thước đo ảo hiện ra. Phần mềm yêu cầu học sinh vẽ một biểu đồ cột ngay bên cạnh đường chạy để so sánh khoảng cách.  
* **Abstract:** Hệ thống đưa ra câu hỏi: "Tại sao xe chạy ngắn nhất trên cát?". Học sinh sử dụng các từ khóa gợi ý (Friction, Rough, Smooth) để trả lời.

## ---

**3\. Quản lý Agile cho Học sinh 8 Tuổi: Khung eduScrum Tùy biến**

Việc áp dụng **Agile và Scrum** cho một đứa trẻ học lớp 3 đòi hỏi sự tinh chỉnh đáng kể. Mục tiêu không phải là "tối ưu hóa năng suất" theo nghĩa doanh nghiệp, mà là phát triển **Kỹ năng Tự điều chỉnh (Self-Regulated Learning \- SRL)** và **Chức năng Điều hành (Executive Function)** của não bộ. Chúng ta sẽ sử dụng khung **eduScrum** 16 làm nền tảng.

### **3.1. Quy trình "Kid-Agile": Chu kỳ Nước rút Hàng tuần**

Chu kỳ Sprint 2 tuần của doanh nghiệp là quá dài đối với nhận thức thời gian của trẻ 8 tuổi. Phản hồi cần nhanh chóng hơn để duy trì động lực.

**Đề xuất Chu kỳ: "Nhiệm vụ Hàng tuần" (1-Week Sprint)**

1. **Thứ Hai: Lập kế hoạch Sprint (Họp Chiến thuật / Mission Briefing)**  
   * Phụ huynh và Con cùng xem **Backlog** (Danh sách bài học của cả kỳ).  
   * Con tự chọn các nhiệm vụ (Tasks) cho tuần này dựa trên hướng dẫn của cha mẹ. *Lưu ý quan trọng:* Sự tự chủ (Autonomy) trong việc chọn thứ tự học (ví dụ: học Toán trước hay Khoa học trước) là yếu tố then chốt để tăng sự cam kết.19  
   * Nhiệm vụ được kéo sang cột "To Do".  
2. **Hàng ngày: Stand-up (Họp Nhanh / Morning Huddle)**  
   * Thời gian: Tối đa 5 phút.  
   * 3 câu hỏi đơn giản hóa:  
     1. *Hôm qua con đã làm được gì vui?* (What did I accomplish?)  
     2. *Hôm nay con định "tiêu diệt" bài nào?* (What will I do today?)  
     3. *Có gì khó quá cần bố/mẹ giúp không?* (Any blockers?)  
3. **Thứ Sáu: Review & Retrospective (Tổng kết & Nhìn lại)**  
   * **Sprint Review:** Con trình diễn những gì đã làm được (Show & Tell). Ví dụ: Chạy lại thí nghiệm ảo cho bố mẹ xem.  
   * **Sprint Retrospective:** Đây là trái tim của việc học cách học.

### **3.2. Quản lý Trực quan: Bảng Kanban Kỹ thuật số cho Trẻ em**

Bảng Kanban là trung tâm điều khiển của phần mềm. Đối với trẻ em, nó phải trực quan, xúc giác và vui nhộn.20

**Cấu trúc Cột Kanban:**

1. **Kho Nhiệm vụ (Quest Log / Backlog):** Chứa tất cả các bài học.  
2. **Sẽ làm tuần này (My Mission / To Do):** Giới hạn 5-7 thẻ để tránh gây choáng ngợp.  
3. **Đang làm (In Action / Doing):** **Giới hạn WIP (Work In Progress) \= 1\.** Đây là quy tắc quan trọng nhất. Trẻ em (và cả người lớn) làm việc kém hiệu quả khi đa nhiệm. Phần mềm phải khóa các bài học khác cho đến khi bài đang nằm trong cột "Doing" được hoàn thành hoặc kéo ngược về "To Do".  
4. **Đã xong (Victory / Done):** Khi thẻ được kéo vào đây, một hiệu ứng ăn mừng (confetti, âm thanh) sẽ xuất hiện.

### **3.3. Retrospective: Công cụ Siêu nhận thức**

Nghiên cứu chỉ ra rằng quy trình Retrospective của Agile tương đồng mạnh mẽ với bước "Đánh giá" (Evaluation) trong phương pháp khoa học.  
Tính năng Phần mềm: Một "Wizard" (Trình hướng dẫn) chạy vào cuối tuần với các câu hỏi gợi mở 23:

* *Cảm xúc:* "Tuần này con thấy thế nào?" (Chọn biểu tượng cảm xúc: Vui, Bình thường, Chán, Tức giận).  
* *Phân tích:* "Điều gì giúp con học tốt nhất?" (Gợi ý: Xem video, Làm thí nghiệm, Có mẹ ngồi cạnh).  
* *Hành động:* "Tuần sau con muốn thay đổi gì?"  
* **Lưu trữ:** Hệ thống ghi lại các dữ liệu này để phụ huynh theo dõi xu hướng tâm lý và phương pháp học tập của con theo thời gian.

## ---

**4\. Vượt qua Rào cản Ngôn ngữ: Chiến lược Tích hợp ESL Đặc thù**

Học Khoa học bằng ngôn ngữ thứ hai đòi hỏi nỗ lực nhận thức gấp đôi: xử lý khái niệm (Khoa học) và xử lý mã ngôn ngữ (Tiếng Anh). Phần mềm phải hoạt động như một hệ thống "Giàn giáo" (Scaffold) thông minh.

### **4.1. BICS và CALP: Cầu nối Ngôn ngữ**

Phần mềm phải giúp học sinh chuyển từ **BICS** (Kỹ năng giao tiếp cơ bản \- ngôn ngữ xã hội) sang **CALP** (Năng lực ngôn ngữ học thuật nhận thức).

* **Chiến lược:** Nhân vật ảo (Avatar) hướng dẫn sẽ sử dụng BICS ("Great job\! Let's look at the next one." \- *Làm tốt lắm, xem cái tiếp theo nào*).  
* **Nội dung:** Các văn bản khoa học và kết luận thí nghiệm sẽ sử dụng CALP ("Magnetic force attracts iron." \- *Lực từ hút sắt*).  
* **Cầu nối:** Sử dụng các "Khung câu" (Sentence Frames) để giúp học sinh tập viết CALP.25

### **4.2. Tính năng: Trình Xây dựng Câu Tương tác (Interactive Sentence Builder)**

Khi học sinh cần viết kết luận khoa học, thay vì đưa ra một ô văn bản trắng (gây lo âu), phần mềm cung cấp các cấp độ hỗ trợ:

* **Cấp độ 1 (Scaffold cao):** Kéo và thả các cụm từ hoàn chỉnh.  
  * \`\` \[moved faster\] \[because\] \[the surface was smooth\].  
* **Cấp độ 2 (Scaffold trung bình):** Cung cấp từ mở đầu (Sentence Starters).  
  * "The car moved faster because..." (Học sinh tự gõ phần còn lại).  
* **Cấp độ 3 (Scaffold thấp):** Chỉ cung cấp Ngân hàng từ vựng (Word Bank).  
  * Gợi ý: *Friction, Surface, Speed*. Học sinh tự xây dựng câu hoàn chỉnh.

### **4.3. Thu nhận Từ vựng: Hệ thống Lặp lại Ngắt quãng (SRS)**

Để đảm bảo từ vựng Tier 2 và Tier 3 đi vào trí nhớ dài hạn, phần mềm tích hợp thuật toán SRS (như Anki/SuperMemo).27

* **Cơ chế:** Khi học sinh gặp một từ mới (ví dụ: *repel* \- đẩy) trong bài Khoa học, từ này tự động được thêm vào "Bộ thẻ" (Word Deck) của môn Tiếng Anh.  
* **Ngữ cảnh hóa:** Thẻ từ vựng (Flashcard) không chỉ hiện định nghĩa. Nó hiển thị **ảnh chụp màn hình** của chính thí nghiệm mà học sinh đã làm khi gặp từ đó. Điều này gắn từ vựng với ký ức trải nghiệm (episodic memory).  
* **Gamification:** Các từ này xuất hiện trong các mini-game bắn súng hoặc ghép cặp trong giờ học Tiếng Anh, với tần suất được thuật toán tính toán để tối ưu hóa điểm rơi của "Đường cong lãng quên" (Forgetting Curve).

## ---

**5\. Đặc tả Chi tiết Tính năng Phần mềm**

Dựa trên sự tổng hợp của Cambridge Science, ESL, CPA và Agile, báo cáo đề xuất các module tính năng cụ thể sau:

### **Module 1: Bàn làm việc của Nhà Khoa học (The Scientist's Workbench) \- Core Science**

**Tính năng 1.1: Động cơ Dự đoán (The Prediction Engine \- TWS Focus)**

* **Mô tả:** Một lớp phủ (modal overlay) xuất hiện bắt buộc trước khi bất kỳ mô phỏng nào chạy.  
* **Chức năng:**  
  * Hiển thị thiết lập thí nghiệm (Ví dụ: "Chúng ta sẽ tưới nước cho Cây A nhưng không tưới cho Cây B").  
  * Hỏi: "Con nghĩ điều gì sẽ xảy ra?" (What do you think will happen?).  
  * Cung cấp lựa chọn hình ảnh (Cây A lớn / Cây A chết) và một trường văn bản cho câu hỏi "Tại sao?".  
  * **Cơ chế Khóa:** Mô phỏng *không thể* bắt đầu cho đến khi dự đoán được "khóa" lại. Điều này bắt buộc học sinh phải tư duy trước khi quan sát.1

**Tính năng 1.2: Phòng Lab Ảo (The Virtual Lab \- VRA/CPA Focus)**

* **Mô tả:** Khung canvas tương tác sử dụng công nghệ WebGL hoặc tích hợp các mô phỏng từ PhET.  
* **Chi tiết cho Stage 3:**  
  * *Thực vật:* Mô phỏng tua nhanh thời gian (Time-lapse). Thanh trượt cho Ánh sáng (Mặt trời/Bóng tối) và Nước. Học sinh quan sát cây héo hoặc lớn lên trong vài giây thay vì vài ngày.29  
  * *Nam châm:* Không gian 2D với các vật liệu khác nhau (gỗ, sắt, nhựa). Công cụ: "Cây đũa thần nam châm". Học sinh kéo đũa qua các vật. Vật bằng sắt sẽ "dính" vào đũa với hiệu ứng âm thanh "click"; vật khác thì không.7  
* **Ghi dữ liệu (Data Logging):** Một bảng bên cạnh tự động điền hoặc yêu cầu nhập thủ công (Ví dụ: "Nó có dính không? Yes/No").

**Tính năng 1.3: Trình tạo Kết luận (The Conclusion Generator \- ESL/CLIL Focus)**

* **Mô tả:** Một trình hướng dẫn (wizard) để tổng kết thí nghiệm.  
* **Chức năng:**  
  * Truy xuất lại Dự đoán ban đầu của học sinh (từ Tính năng 1.1).  
  * Truy xuất dữ liệu thực tế (từ Tính năng 1.2).  
  * Hỏi: "Dự đoán của con có đúng không?" (Was your prediction correct?).  
  * Hỗ trợ viết câu kết luận bằng các mẫu câu đã đề cập ở mục 4.2.

### **Module 2: Phòng Ngôn ngữ (The Language Lab) \- ESL Integration**

**Tính năng 2.1: Glossary Ngữ cảnh (The "Word Catcher")**

* **Mô tả:** Công cụ toàn hệ thống nằm ở thanh bên (sidebar).  
* **Chức năng:**  
  * **Văn bản Siêu liên kết:** Tất cả từ vựng Tier 3 trong bài học Khoa học (ví dụ: *roots, friction*) đều có thể nhấp vào.  
  * **Thẻ Pop-up:** Khi nhấp vào, hiển thị:  
    * Định nghĩa đơn giản hóa (ngôn ngữ Tier 1).  
    * Hình ảnh/Icon (Pictorial).  
    * Nút Âm thanh (TTS \- Natural Reader API).11  
    * Nút "Add to Deck" để đưa vào trò chơi ôn tập SRS.

**Tính năng 2.2: Trợ lý Đọc to (Read-Aloud Assistant \- Accessibility)**

* **Mô tả:** Tích hợp Text-to-Speech (TTS) sử dụng giọng đọc AI tự nhiên (Neural Voices) như OpenAI Audio hoặc Azure Cognitive Services.11  
* **Chức năng:**  
  * Highlight theo lời đọc (Karaoke style) để học sinh theo dõi mặt chữ.  
  * Điều khiển tốc độ (0.75x cho học sinh ESL).  
  * **Phân vai:** Sử dụng các giọng khác nhau cho Người dẫn chuyện (hướng dẫn) và Nhân vật (câu chuyện) để giúp phân biệt ngữ cảnh.

**Tính năng 2.3: AI Đơn giản hóa Văn bản (AI Text Simplifier \- Differentiation)**

* **Mô tả:** Nút "Đũa thần" bên cạnh các đoạn văn bản dài/khó.  
* **Chức năng:**  
  * Sử dụng OpenAI API để viết lại đoạn văn.  
  * **Kỹ thuật Prompt Engineering:** "Viết lại đoạn văn này cho trình độ đọc lớp 2, giữ nguyên các thuật ngữ khoa học như 'photosynthesis' và 'roots' nhưng đơn giản hóa cấu trúc câu.".31  
  * Cho phép học sinh chuyển đổi giữa "Bản gốc" (Thử thách) và "Bản đơn giản" (Hỗ trợ).

### **Module 3: Bảng điều khiển Agile (The Agile Dashboard) \- Management Core**

**Tính năng 3.1: Bảng Kanban Nhí (Kid-Kanban Board)**

* **Mô tả:** Trang chủ của ứng dụng.  
* **UI/UX:** Màu sắc tươi sáng, thẻ to, thao tác kéo-thả.  
* **Cấu trúc:** *Quest Log* \-\> *My Mission* \-\> *In Action* \-\> *Victory*.20  
* **Tích hợp Avatar:** Avatar của trẻ sẽ đứng trên đầu cột mà trẻ đang làm việc, tạo cảm giác hiện diện.

**Tính năng 3.2: Trình Lập kế hoạch Sprint (Sprint Planner Wizard)**

* **Mô tả:** Hoạt động vào tối Chủ nhật hoặc sáng Thứ hai.  
* **Chức năng:**  
  * Hiển thị cho Phụ huynh các yêu cầu chương trình của tuần.  
  * Cho phép Trẻ tự kéo các bài học cụ thể vào cột "Mission" của mình.  
  * **Kiến trúc Lựa chọn (Choice Architecture):** "Con muốn làm bài Nam châm vào Thứ ba hay Thứ tư?" (Trao quyền kiểm soát thời gian, nhưng không thay đổi khối lượng công việc).19

**Tính năng 3.3: Minigame "Retro"**

* **Mô tả:** Phản ánh cuối tuần.  
* **Chức năng:**  
  * Chọn biểu cảm (Emoji) cho tâm trạng tuần qua.  
  * Ghi âm giọng nói: "Kể cho mẹ nghe một điều con đã học được."  
  * Dữ liệu này được lưu trữ để phụ huynh xem lại.

## ---

**6\. Chiến lược Tích hợp Sâu: Mạch Nội dung Khoa học và ESL**

Phần này đi sâu vào cách xử lý từng mạch nội dung cụ thể của Stage 3 để đảm bảo tính năng phần mềm bám sát yêu cầu chương trình.

### **6.1. Chi tiết Khoa học: Xử lý các Mạch (Strands)**

#### **6.1.1. Sinh học: Thực vật và Con người**

* **Thách thức:** Các khái niệm Sinh học ở Stage 3 (chức năng tim/phổi) là trừu tượng vì chúng nằm bên trong cơ thể và vô hình.  
* **Giải pháp Phần mềm: Lớp phủ AR (Augmented Reality Layers).**  
  * *Hoạt động:* "Máy quét cơ thể" (Body Scanner). Học sinh di chuyển một thanh trượt qua hình vẽ cơ thể người. Khi thanh trượt đi qua, lớp "da" trở nên trong suốt, lộ ra xương, rồi đến nội tạng.  
  * *Tích hợp ESL:* Khi nhấp vào tim, âm thanh phát ra: "The heart pumps blood" (Tim bơm máu).  
  * *CPA:* Yếu tố "Cụ thể" ở đây là thao tác trượt để "giải phẫu" các lớp.

#### **6.1.2. Hóa học: Tính chất Vật liệu**

* **Thách thức:** Phân biệt tính chất (trong suốt, linh hoạt, cứng) đòi hỏi xúc giác mà màn hình không có.  
* **Giải pháp Phần mềm: Truy tìm Kho báu Thực tế (Scavenger Hunts).**  
  * Phần mềm không thể mô phỏng "độ nhám" hoàn hảo. Thay vào đó, thẻ Agile cho bài này sẽ yêu cầu: "Tìm một vật gì đó *rough* (nhám) trong nhà con."  
  * *Cầu nối:* Trẻ đi tìm một miếng giấy nhám hoặc vỏ quả sầu riêng. Trẻ quay lại máy tính và chụp ảnh/tải ảnh vật đó lên.  
  * *Phân loại:* Trẻ kéo ảnh đó vào cột "Rough" trong bảng phân loại kỹ thuật số. Điều này hòa trộn trải nghiệm vật lý thực tế với phân loại kỹ thuật số.4

#### **6.1.3. Vật lý: Lực**

* **Thách thức:** Các quan niệm sai lầm về lực vô hình (ví dụ: "lực nằm bên trong vật").  
* **Giải pháp Phần mềm: Trực quan hóa Vector.**  
  * Trong mọi mô phỏng, luôn hiển thị lực dưới dạng các mũi tên (vector).  
  * *Khái niệm:* Lực lớn hơn \= Mũi tên dài hơn.  
  * *Thuật ngữ ESL:* Liên kết rõ ràng hình ảnh mũi tên với các từ "Push" (Đẩy), "Pull" (Kéo), và "Newtons".7

### **6.2. Chi tiết ESL: Phương pháp "Bánh mì kẹp" (Sandwich Method)**

Để dạy các khái niệm Khoa học phức tạp bằng L2, phần mềm nên sử dụng phương pháp Sandwich:

1. **Lớp trên:** Giới thiệu khái niệm bằng tiếng Anh đơn giản, rõ ràng (hoặc thậm chí tiếng mẹ đẻ nếu cần thiết để đảm bảo hiểu đúng bản chất). "Magnets have two ends." (Nam châm có hai đầu).  
2. **Nhân:** Bài học/Mô phỏng diễn ra bằng tiếng Anh mục tiêu (Target English \- Tier 2/3). "The North Pole and South Pole attract."  
3. **Lớp dưới:** Tóm tắt và kiểm tra lại bằng tiếng Anh đơn giản. "So, opposite ends pull together." (Vậy, hai đầu ngược nhau thì hút nhau).

## ---

**7\. Triển khai Kỹ thuật & An toàn AI**

### **7.1. Generative AI cho Thích ứng Nội dung**

Sử dụng OpenAI API (hoặc các LLM tương tự) là công cụ mạnh mẽ để cá nhân hóa nội dung "ngay lập tức" (On-the-fly), nhưng cần các rào chắn (guardrails) nghiêm ngặt.31

* **Kiến trúc Prompt Engineering:**  
  * *Vai trò (Role):* "Bạn là một giáo viên Khoa học Tiểu học Cambridge."  
  * *Nhiệm vụ (Task):* "Giải thích khái niệm 'quang hợp' cho một học sinh ESL 8 tuổi."  
  * *Ràng buộc (Constraint):* "Sử dụng cấu trúc câu đơn giản. In đậm các từ khóa: **light**, **water**, **food**. Tối đa 50 từ."  
  * *An toàn (Safety):* "Không sử dụng các phép ẩn dụ liên quan đến bạo lực hoặc các tham chiếu văn hóa phức tạp."

### **7.2. Tạo hình ảnh và Bộ lọc An toàn**

Nếu phần mềm có tính năng tạo hình ảnh (ví dụ: "Vẽ một cái cây trên Sao Hỏa" dựa trên mô tả của học sinh), nó phải sử dụng các bộ lọc an toàn.

* **API filters:** Sử dụng Azure OpenAI Content Filters hoặc Google's Content Safety API để chặn nội dung không phù hợp ngay tại cấp độ tạo sinh.33  
* **Danh sách đen từ khóa:** Cấm cứng các thuật ngữ không phù hợp với trẻ em.

### **7.3. Khuyến nghị Tech Stack**

* **Frontend:** React.js hoặc Vue.js (để tạo bảng Kanban phản ứng nhanh và giao diện kéo thả mượt mà).  
* **Game Engine:** Phaser.js hoặc Unity (nhúng) cho các mô phỏng Vật lý phức tạp.  
* **Backend:** Node.js/Python (để xử lý các cuộc gọi OpenAI API và quản lý cơ sở dữ liệu).  
* **Database:** Firebase hoặc MongoDB (cơ sở dữ liệu linh hoạt để lưu trữ "Thẻ Agile" và "Bộ từ vựng" cá nhân hóa).

## ---

**8\. Kết luận và Lộ trình**

Hệ thống phần mềm được đề xuất đại diện cho một sự chuyển đổi mô hình từ "sách giáo khoa số hóa" sang một "hệ điều hành học tập". Bằng cách đan xen nội dung **Khoa học Cambridge** với các giàn giáo **ESL**, và vận hành toàn bộ trải nghiệm thông qua giao diện quản lý **Agile/eduScrum**, hệ thống giải quyết một cách toàn diện nhu cầu của phụ huynh dạy con tại nhà và học sinh Lớp 3\.

Kiến trúc này thừa nhận rằng đối với một đứa trẻ 8 tuổi, việc học không phải là tuyến tính; nó là sự lặp lại và thử nghiệm. Mạch **TWS** (Tư duy và Làm việc Khoa học) cung cấp chu kỳ truy vấn, trong khi **Agile** cung cấp chu kỳ làm việc. Việc hợp nhất hai chu kỳ này thành một bảng điều khiển thống nhất—được hỗ trợ bởi các mô phỏng **CPA/VRA** và hỗ trợ ngôn ngữ **AI**—tạo ra một hệ sinh thái mạnh mẽ. Hệ thống này không chỉ dạy Khoa học và Tiếng Anh; nó dạy đứa trẻ *cách học*, cách quản lý nhiệm vụ của mình và cách suy ngẫm về sự tiến bộ của bản thân—những kỹ năng vượt xa khỏi phạm vi sách vở.

### **8.1. Các bước tiếp theo (Next Steps)**

1. **Tạo mẫu Bảng Kanban:** Thử nghiệm quy trình "Nhiệm vụ Hàng tuần" với thẻ giấy thật để kiểm chứng mức độ tham gia của trẻ trước khi viết code.  
2. **Xây dựng Cơ sở dữ liệu "Từ điển Khoa học":** Ánh xạ danh sách Từ vựng Cambridge Stage 3 6 với các định nghĩa và tìm/tạo bộ icon minh họa.  
3. **Lựa chọn Engine Vật lý:** Thử nghiệm cụ thể các thư viện mã nguồn mở của PhET để đảm bảo chúng có thể được nhúng và "bọc" (wrap) bởi các lớp giàn giáo Dự đoán/Kết luận của ESL.

Báo cáo này cung cấp đầy đủ các đặc tả lý thuyết và chức năng cần thiết để bắt đầu giai đoạn xây dựng (build phase) của nền tảng giáo dục này.

#### **Works cited**

1. Cambridge Primary Science, accessed January 2, 2026, [https://cambridge-community.org.uk/guide-to/cambridge-primary/science/](https://cambridge-community.org.uk/guide-to/cambridge-primary/science/)  
2. Cambridge Primary Science (0097), accessed January 2, 2026, [https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-primary/curriculum/science/](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-primary/curriculum/science/)  
3. Curriculum Framework Cambridge Primary Science 0846 \- Chartwell International School, accessed January 2, 2026, [https://chartwell.edu.rs/images/pdf/0846\_Primary\_Science\_Curriculum\_Framework\_2018\_tcm142-498593.pdf](https://chartwell.edu.rs/images/pdf/0846_Primary_Science_Curriculum_Framework_2018_tcm142-498593.pdf)  
4. Thinking and Working Scientifically Stage 1 \- 6 | PDF \- Scribd, accessed January 2, 2026, [https://www.scribd.com/document/870728129/Thinking-and-Working-Scientifically-Stage-1-6](https://www.scribd.com/document/870728129/Thinking-and-Working-Scientifically-Stage-1-6)  
5. Scheme of Work – Science stage 3 \- Nord Anglia Education, accessed January 2, 2026, [https://img.nordangliaeducation.com/resources/asia/\_filecache/fba/ccb/50542-scheme-of-work-science-stage-3v1.doc](https://img.nordangliaeducation.com/resources/asia/_filecache/fba/ccb/50542-scheme-of-work-science-stage-3v1.doc)  
6. Science Vocabulary Progression Map \- Florence Melly Community Primary School, accessed January 2, 2026, [https://florencemelly.org/wp-content/uploads/2024/05/Science-Vocabulary-Progression.pdf](https://florencemelly.org/wp-content/uploads/2024/05/Science-Vocabulary-Progression.pdf)  
7. 0097 Primary Science Stage 3 Scheme of Work\_tcm142-595392.docx, accessed January 2, 2026, [https://cursa.ihmc.us/rid=1X0Z7G4J2-29SYP75-4DZL/0097%20Primary%20Science%20Stage%203%20Scheme%20of%20Work\_tcm142-595392.docx](https://cursa.ihmc.us/rid=1X0Z7G4J2-29SYP75-4DZL/0097%20Primary%20Science%20Stage%203%20Scheme%20of%20Work_tcm142-595392.docx)  
8. P \- Science \- 3 \- Language Worksheets \- Unit 5 | PDF | Force | Physics \- Scribd, accessed January 2, 2026, [https://www.scribd.com/document/722571590/P-Science-3-Language-Worksheets-Unit-5](https://www.scribd.com/document/722571590/P-Science-3-Language-Worksheets-Unit-5)  
9. Stage 3, accessed January 2, 2026, [https://www.pea.ae/linkfiles/English\_Primary\_Framework/Stage3.pdf](https://www.pea.ae/linkfiles/English_Primary_Framework/Stage3.pdf)  
10. Understanding Command words in exams \- Cambridge International Education, accessed January 2, 2026, [https://www.cambridgeinternational.org/exam-administration/what-to-expect-on-exams-day/command-words/](https://www.cambridgeinternational.org/exam-administration/what-to-expect-on-exams-day/command-words/)  
11. NaturalReader \- Text To Speech \- App Store \- Apple, accessed January 2, 2026, [https://apps.apple.com/us/app/naturalreader-text-to-speech/id1487572960](https://apps.apple.com/us/app/naturalreader-text-to-speech/id1487572960)  
12. Teaching Science through English – a CLIL approach, accessed January 2, 2026, [https://www.cambridgeenglish.org/Images/179514-teaching-science-through-english-a-clil-approach.pdf](https://www.cambridgeenglish.org/Images/179514-teaching-science-through-english-a-clil-approach.pdf)  
13. CLIL: A lesson framework | TeachingEnglish \- British Council, accessed January 2, 2026, [https://www.teachingenglish.org.uk/professional-development/teachers/knowing-subject/clil-lesson-framework](https://www.teachingenglish.org.uk/professional-development/teachers/knowing-subject/clil-lesson-framework)  
14. Concrete Pictorial Abstract with Virtual Manipulatives \- Brainingcamp, accessed January 2, 2026, [https://www.brainingcamp.com/blog/posts/concrete-pictorial-abstract-with-virtual-manipulatives](https://www.brainingcamp.com/blog/posts/concrete-pictorial-abstract-with-virtual-manipulatives)  
15. PhET: Free online physics, chemistry, biology, earth science and math simulations, accessed January 2, 2026, [https://phet.colorado.edu/](https://phet.colorado.edu/)  
16. 'Flap' eduScrum Educational Board Template | Miroverse, accessed January 2, 2026, [https://miro.com/templates/flap-eduscrum-educational-board/](https://miro.com/templates/flap-eduscrum-educational-board/)  
17. Using Constructive Alignment, eduScrum and Tableau to Teach Managerial Analytics \- ERIC, accessed January 2, 2026, [https://files.eric.ed.gov/fulltext/EJ1426478.pdf](https://files.eric.ed.gov/fulltext/EJ1426478.pdf)  
18. Teaching programming using eduScrum methodology \- PMC \- NIH, accessed January 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC10909224/](https://pmc.ncbi.nlm.nih.gov/articles/PMC10909224/)  
19. One Kid'z Kanban Board, accessed January 2, 2026, [https://www.personalkanban.com/pk/featured/one-kidz-kanban-board-2](https://www.personalkanban.com/pk/featured/one-kidz-kanban-board-2)  
20. Kanban your Kids: Chore Charts that Work \- Five Senses Literature Lessons, accessed January 2, 2026, [https://5sensesll.com/2023/10/kanban-your-kids-chore-charts-that-work/](https://5sensesll.com/2023/10/kanban-your-kids-chore-charts-that-work/)  
21. Best Simple Kanban Boards for Family and Home Projects \- Any.do, accessed January 2, 2026, [https://www.any.do/blog/best-simple-kanban-boards-for-family-and-home-projects/](https://www.any.do/blog/best-simple-kanban-boards-for-family-and-home-projects/)  
22. Kids Kanban: Ultimate Chore & School Task Guide \- Sengerson, accessed January 2, 2026, [https://www.sengerson.com/kanban-for-kids/](https://www.sengerson.com/kanban-for-kids/)  
23. 50+ Retrospective Questions for your Next Meeting \- Parabol, accessed January 2, 2026, [https://www.parabol.co/resources/retrospective-questions/](https://www.parabol.co/resources/retrospective-questions/)  
24. 120 Questions to Improve your Sprint Retrospectives \- Neatro, accessed January 2, 2026, [https://www.neatro.io/blog/sprint-retrospective-questions/](https://www.neatro.io/blog/sprint-retrospective-questions/)  
25. Scaffolding Complex Text for English Learners \- CORE Learning, accessed January 2, 2026, [https://www.corelearn.com/wp-content/uploads/2018/04/CABE-handoutfinal.pdf](https://www.corelearn.com/wp-content/uploads/2018/04/CABE-handoutfinal.pdf)  
26. Sentence Frames and Sentence Starters \- Colorín Colorado, accessed January 2, 2026, [https://www.colorincolorado.org/teaching-ells/ell-classroom-strategy-library/sentence-frames](https://www.colorincolorado.org/teaching-ells/ell-classroom-strategy-library/sentence-frames)  
27. 8 Best Spaced Repetition Apps For Language Learning \- Lingopie, accessed January 2, 2026, [https://lingopie.com/blog/spaced-repetition/](https://lingopie.com/blog/spaced-repetition/)  
28. Spaced Repetition: Master Any Language Fast \- Busuu, accessed January 2, 2026, [https://www.busuu.com/en/languages/spaced-repetition](https://www.busuu.com/en/languages/spaced-repetition)  
29. Teaching ideas \- Assets \- Cambridge University Press, accessed January 2, 2026, [https://assets.cambridge.org/97811076/11504/excerpt/9781107611504\_excerpt.pdf](https://assets.cambridge.org/97811076/11504/excerpt/9781107611504_excerpt.pdf)  
30. Any good text-to-speech tools you can recommend? Preferably easy-to-use : r/Dyslexia, accessed January 2, 2026, [https://www.reddit.com/r/Dyslexia/comments/1ejv4db/any\_good\_texttospeech\_tools\_you\_can\_recommend/](https://www.reddit.com/r/Dyslexia/comments/1ejv4db/any_good_texttospeech_tools_you_can_recommend/)  
31. Best practices for prompt engineering with the OpenAI API, accessed January 2, 2026, [https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)  
32. Api configuration endpoint (for prompt engineering) \- OpenAI Developer Community, accessed January 2, 2026, [https://community.openai.com/t/api-configuration-endpoint-for-prompt-engineering/48626](https://community.openai.com/t/api-configuration-endpoint-for-prompt-engineering/48626)  
33. Azure OpenAI in Microsoft Foundry Models content filtering, accessed January 2, 2026, [https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/content-filter?view=foundry-classic](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/content-filter?view=foundry-classic)  
34. Discover our child safety toolkit \- Fighting child sexual abuse online, accessed January 2, 2026, [https://protectingchildren.google/tools-for-partners/](https://protectingchildren.google/tools-for-partners/)  
35. Wordlists \- Cambridge English, accessed January 2, 2026, [https://www.cambridgeenglish.org/images/149681-yle-flyers-word-list.pdf](https://www.cambridgeenglish.org/images/149681-yle-flyers-word-list.pdf)