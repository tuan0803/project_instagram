#!/bin/bash

set -e

if [ -f tmp/pids/server.pid ]; then
    rm tmp/pids/server.pid
fi

# Chạy quy trình 1: Migrate database
npm run migrate:up &

# Chạy quy trình 2: Rails server
npm run seed &

# Chạy qui trình 3: Start server
npm run start

# Chờ các tiến trình chạy xong
wait

echo "Finished to start server"

# Nếu bạn muốn thêm các lệnh khác sau khi cả hai quy trình hoàn thành, bạn có thể thêm chúng ở đây
exec "$@"
