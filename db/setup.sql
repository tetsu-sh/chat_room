CREATE DATABASE IF NOT EXISTS chat_app;
CREATE DATABASE IF NOT EXISTS chat_app_test;

USE chat_app;

GRANT ALL PRIVILEGES ON `chat_app`.* TO 'kuroneko'@'%';
GRANT ALL PRIVILEGES ON `chat_app_test`.* TO 'kuroneko'@'%';

FLUSH PRIVILEGES;

