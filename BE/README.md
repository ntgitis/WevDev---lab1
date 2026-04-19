# Lab 2 Backend (Express + MongoDB)

## 1) Cài dependencies

```bash
npm install
```

## 2) Cấu hình MongoDB Atlas

Tạo file `.env` trong thư mục `BE` với nội dung:

```env
DB_URL=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

## 3) Nạp dữ liệu mẫu

```bash
node ./db/dbLoad.js
```

## 4) Chạy backend

```bash
npm start
```

Mặc định server chạy ở `http://localhost:8081`.

## API đã triển khai

- `GET /user/list`
- `GET /user/:id`
- `GET /photosOfUser/:id`

Các endpoint validate `id` và trả HTTP `400` khi `id` không hợp lệ hoặc không phải user tồn tại.
