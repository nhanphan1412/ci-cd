# Demo Đánh Giá Thăng Bằng Kinis

Đây là một demo theo định hướng frontend, mô phỏng luồng đánh giá thăng bằng
thân thiện với người lớn tuổi, lấy cảm hứng từ hướng sản phẩm trong mô tả công
việc Front-End Engineer của Kinis.ai.

Ứng dụng tập trung vào:

- luồng onboarding rõ ràng, nhẹ nhàng cho người dùng lớn tuổi
- xử lý quyền camera và phần preview
- các trạng thái runtime rõ ràng trong quá trình assessment
- kết quả AI giả lập kèm khuyến nghị cá nhân hóa
- kiến trúc UI có thể tái sử dụng với `Next.js App Router`

## Câu chuyện của demo

Project này mô phỏng một bài kiểm tra khả năng vận động nhẹ có thể thực hiện tại nhà:

1. người dùng xem các yêu cầu an toàn và nhập thông tin cơ bản
2. ứng dụng xin quyền truy cập camera hoặc chuyển sang preview mô phỏng
3. người dùng thực hiện một phiên kiểm tra ngắn với countdown và phản hồi tiến độ
4. sau khi hoàn tất, hệ thống trả về điểm số giả lập, mức độ rủi ro và kế hoạch bài tập gợi ý

Phần tính điểm được mock có chủ đích. Mục tiêu của demo không phải chứng minh
độ chính xác lâm sàng, mà là thể hiện tư duy sản phẩm phía frontend, kiến trúc
component, định hướng accessibility và khả năng sẵn sàng tích hợp backend/model.

## Vì sao đây là demo tốt để đi phỏng vấn

Codebase này giúp bạn trình bày tốt các điểm sau:

- cách thiết kế cho người dùng từ 50 tuổi trở lên
- cách làm cho một luồng UX dùng camera trở nên dễ hiểu
- cách tách riêng UI flow khỏi lớp AI analysis
- cách dùng mock API có tính xác định để frontend có thể thay bằng backend phân tích chuyển động thật sau này

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- các UI primitive theo phong cách `shadcn/ui`

## Cấu trúc project

- `app/page.tsx`: trang landing
- `app/assessment/page.tsx`: màn hình setup và xác nhận an toàn
- `app/assessment/session/page.tsx`: phiên kiểm tra có hướng dẫn bằng camera
- `app/results/page.tsx`: màn hình kết quả và kế hoạch bài tập
- `app/progress/page.tsx`: màn hình tiến trình và lịch sử các phiên gần đây
- `app/api/assessments/*`: mock API contract để tạo và hoàn tất session
- `components/templates/*`: lớp ghép trang ở mức page
- `components/organisms/*`: các section tính năng và luồng tương tác chính
- `lib/mock-assessment-store.ts`: nơi lưu session trong bộ nhớ và sinh kết quả mock

## Chạy project ở máy local

Cài dependencies và khởi động development server:

```bash
npm install
npm run dev
```

Sau đó mở [http://localhost:3000](http://localhost:3000).

## Các quyết định về sản phẩm

### 1. UX ưu tiên người lớn tuổi

Giao diện dùng khoảng cách lớn hơn, ngôn ngữ trực diện, lời kêu gọi hành động rõ
ràng và trạng thái dễ nhận biết. Mục tiêu là giảm tải nhận thức và tạo cảm giác
đáng tin cậy trong suốt phiên đánh giá.

### 2. Fallback cho camera

Demo phỏng vấn thường chạy trong môi trường khó đoán trước. Nếu quyền camera bị
từ chối hoặc phần cứng không sẵn sàng, ứng dụng có thể chuyển sang preview mô
phỏng để toàn bộ flow vẫn tiếp tục được.

### 3. Ranh giới tích hợp AI giả lập

Kết quả phân tích được sinh ra thông qua một API contract nhỏ thay vì hardcode
thẳng trong giao diện. Cách này giúp frontend được tổ chức giống một sản phẩm
thật, để sau này có thể thay bằng model production hoặc backend service dễ hơn.

## Tradeoff hiện tại

- kết quả hiện là dữ liệu mock, không có giá trị lâm sàng
- dữ liệu đang được lưu trong bộ nhớ và sẽ mất khi server restart
- phiên bản này chưa có authentication hoặc dashboard cho clinician

## Các ý nên nói khi phỏng vấn

- Vì sao flow được tách thành setup, session và results
- Cách xử lý khi người dùng từ chối quyền camera hoặc thiết bị không hỗ trợ
- Vì sao UX trong healthcare cần phản hồi rõ ràng hơn sản phẩm consumer thông thường
- API boundary sẽ phát triển như thế nào khi thêm model movement intelligence thật

## Hướng cải thiện tiếp theo

- tích hợp pose estimation hoặc motion events từ backend thật
- thêm theo dõi xu hướng qua nhiều session
- hỗ trợ đa ngôn ngữ
- thực hiện accessibility review cho nhóm người dùng lớn tuổi

## Tài liệu bổ sung

- `docs/kich-ban-demo-phong-van.md`: kịch bản nói demo 2-3 phút khi đi phỏng vấn
