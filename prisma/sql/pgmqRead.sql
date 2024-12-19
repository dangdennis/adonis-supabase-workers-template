SELECT * FROM pgmq.read(queue_name => $1::text, vt => $2::int, qty => $3::int)
