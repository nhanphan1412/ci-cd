# Kịch Bản Demo Phỏng Vấn

Tài liệu này giúp bạn giới thiệu demo trong khoảng 2-3 phút khi phỏng vấn vị
trí Front-End Engineer.

## Mục tiêu khi trình bày

Bạn không cần cố chứng minh rằng đây là một mô hình AI hoàn chỉnh. Thay vào đó,
hãy tập trung vào 4 điểm:

- tư duy thiết kế sản phẩm cho người dùng lớn tuổi
- khả năng tổ chức flow nhiều trạng thái trong frontend
- cách tách UI khỏi lớp phân tích AI
- khả năng biến kết quả thành hành động tiếp theo có ý nghĩa

## Script gợi ý 2-3 phút

### 1. Mở đầu

"Đây là một demo frontend mô phỏng sản phẩm đánh giá thăng bằng tại nhà cho
người dùng lớn tuổi, lấy cảm hứng từ hướng sản phẩm của Kinis.ai. Em cố ý chọn
phạm vi vừa đủ để tập trung vào trải nghiệm người dùng, kiến trúc UI và ranh
giới tích hợp AI, thay vì cố mô phỏng độ chính xác lâm sàng."

### 2. Giới thiệu landing page

"Ở landing page, em muốn thể hiện rõ đây là một healthcare-like flow chứ không
phải chỉ là một form thông thường. Người dùng thấy ngay mục tiêu của bài kiểm
tra, lý do bài toán này phù hợp với người lớn tuổi, và quy trình tổng thể gồm
chuẩn bị, thực hiện và xem kết quả."

### 3. Giới thiệu màn hình setup

"Ở bước setup, em ưu tiên onboarding thật rõ ràng. Người dùng nhập thông tin cơ
bản, chọn mục tiêu vận động, chọn mức độ tự tin hiện tại và xác nhận checklist
an toàn. Em tách bước này riêng ra vì trong sản phẩm healthcare, nếu bỏ qua
ngữ cảnh và an toàn thì trải nghiệm camera phía sau sẽ kém tin cậy hơn."

### 4. Giới thiệu session camera

"Đây là phần em muốn nhấn mạnh nhất ở góc nhìn frontend. Màn hình này xử lý xin
quyền camera, preview trực tiếp, countdown, tiến độ theo thời gian, trạng thái
đang xử lý và cả fallback nếu camera không dùng được. Khi đi phỏng vấn, nếu môi
trường demo không cho bật camera, em vẫn có thể chuyển sang preview mô phỏng mà
không làm gãy toàn bộ flow."

### 5. Giới thiệu màn hình kết quả

"Sau khi phiên kiểm tra hoàn tất, app trả về điểm số mock, mức rủi ro, phần
diễn giải ngắn gọn và kế hoạch bài tập gợi ý. Em cố tình không chỉ hiển thị mỗi
điểm số, vì với sản phẩm chăm sóc sức khỏe thì điều quan trọng là giúp người
dùng hiểu họ nên làm gì tiếp theo."

### 6. Giới thiệu màn hình tiến trình

"Ngoài kết quả của một phiên đơn lẻ, em thêm một màn tiến trình nhỏ để thể hiện
định hướng mở rộng sản phẩm sang theo dõi lịch sử và xu hướng theo thời gian.
Phần này vẫn dùng dữ liệu mock trong bộ nhớ, nhưng API contract đã đủ rõ để nối
thêm database hoặc dashboard clinician về sau."

### 7. Chốt về kỹ thuật

"Về kỹ thuật, em tách flow thành landing, setup, session và results. Em dùng
component architecture để dễ tái sử dụng và review. Phần AI hiện được mock qua
API contract rõ ràng, nên khi có backend hoặc model thật, frontend có thể tích
hợp mà không phải thiết kế lại trải nghiệm."

### 8. Kết thúc

"Nếu có thêm thời gian, em sẽ mở rộng demo theo ba hướng: tích hợp pose
estimation hoặc movement events thật, thêm lịch sử theo dõi qua nhiều session,
và kiểm thử accessibility sâu hơn cho người dùng lớn tuổi."

## Cách dẫn demo trên màn hình

1. Mở landing page và nói ngắn gọn bài toán đang giải.
2. Chuyển sang màn setup, nhấn mạnh safety checklist và user context.
3. Sang màn session, ưu tiên cho người phỏng vấn thấy flow xin quyền camera.
4. Nếu camera không chạy, chuyển sang preview mô phỏng và giải thích fallback.
5. Bắt đầu bài kiểm tra và chờ sang màn hình kết quả.
6. Chốt bằng phần score, risk level và exercise plan.

## Câu trả lời ngắn cho các câu hỏi thường gặp

### "AI ở đâu?"

"Trong demo này em chủ động mock lớp AI để tập trung vào frontend architecture,
UX và integration boundary. Em muốn chứng minh rằng khi model thật sẵn sàng,
frontend đã có cấu trúc đủ tốt để gắn vào ngay."

### "Vì sao em không làm luôn backend thật?"

"Ở phạm vi demo phỏng vấn, em ưu tiên chiều sâu frontend thay vì dàn trải. Em
muốn phần camera flow, accessibility và results experience đủ chỉn chu để thể
hiện năng lực phù hợp nhất với vị trí Front-End Engineer."

### "Điểm mạnh nhất của demo này là gì?"

"Điểm mạnh nhất là em không chỉ làm một landing page đẹp, mà em mô hình hóa
được một flow sản phẩm có nhiều trạng thái khó và vẫn giữ được trải nghiệm rõ
ràng, dễ hiểu cho người dùng cuối."
