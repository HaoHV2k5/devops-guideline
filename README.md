# devops-guideline

> **Lộ trình DevOps 12 tuần cho Java Backend** — Giao diện Miro Whiteboard tương tác được xây dựng với Next.js 16, Tailwind CSS và GSAP.

## 🎯 Mục tiêu
- 12 tuần · khoảng 1,5–2 giờ/ngày.
- Chuyển hóa tư duy từ **"làm được"** sang **"hiểu vì sao"** để tự tin phỏng vấn.
- Phương pháp học cốt lõi: **Đọc → Tự làm → Cố tình làm hỏng → Debug → Ghi lại**.

## ✨ Tính năng giao diện (Miro Design System)
- **Miro Dot-Grid Infinite Canvas:** Bảng vẽ trực quan với phong cách Miro, thẻ Sticky Notes pastel, băng dính Washi Tape và chuột cộng tác.
- **GSAP Animation:** Hiệu ứng nảy thẻ, nghiêng tự nhiên, hover physics và confetti chúc mừng khi hoàn thành tuần học.
- **Lab "Cố tình làm hỏng & Debug":** Kịch bản sự cố thực chiến cho cả 12 tuần kèm lệnh debug từng bước (`jstack`, `top -H`, `docker inspect`, `kubectl describe`...).
- **Flashcard Luyện phỏng vấn ("Tại sao?"):** Chế độ ẩn/hiện câu trả lời giúp luyện nói thành tiếng và tra cứu từ khóa phỏng vấn (Keywords checklist).
- **Cheat Sheet Terminal:** Bảng tra cứu hơn 30+ câu lệnh Linux, JVM, Docker, Kubernetes, Helm, Terraform với chức năng 1-click copy.
- **3 Chế độ xem linh hoạt:** Miro Board Canvas, Lộ trình tuần dọc (Timeline), và Khung giai đoạn (Kanban).

## 🚀 Khởi chạy dự án

Cài đặt các gói phụ thuộc và chạy môi trường dev:

```bash
# Cài đặt thư viện
npm install

# Khởi chạy dev server
npm run dev
```

Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)

## 📦 Công nghệ sử dụng
- **Framework:** Next.js 16 (App Router) & React 19
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS v4 & Lucide Icons
- **Hiệu ứng:** GSAP (`gsap`, `@gsap/react`) & `canvas-confetti`
- **Thiết kế:** `npx getdesign add miro` (`DESIGN.md`), UI/UX Pro Max
