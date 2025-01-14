# Sử dụng một image Node.js làm base
FROM node:18.17.0

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các phụ thuộc dự án
RUN npm install

# Sao chép mã nguồn dự án vào container
COPY . .


# Sao chép mã nguồn dự án vào container
RUN npm run build-ts

# Mở cổng mà ứng dụng sẽ chạy trên đó
EXPOSE 4000
EXPOSE 8000

# Định nghĩa lệnh để chạy ứng dụng
RUN chmod +x ./start.sh
ENTRYPOINT [ "./start.sh" ]
