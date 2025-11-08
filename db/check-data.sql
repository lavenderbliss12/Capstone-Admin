-- Quick check: what's actually in your database?
-- Run this in phpMyAdmin SQL tab or MySQL CLI

USE capstone;

-- Count rows in each table
SELECT 'user_info' as table_name, COUNT(*) as row_count FROM user_info
UNION ALL
SELECT 'transaction', COUNT(*) FROM transaction
UNION ALL
SELECT 'biowaste_disposal', COUNT(*) FROM biowaste_disposal
UNION ALL
SELECT 'checkpoint', COUNT(*) FROM checkpoint
UNION ALL
SELECT 'reward', COUNT(*) FROM reward;

-- Show recent users
SELECT user_id, uid, username, surname, name, email, total_points, date_registered 
FROM user_info 
ORDER BY user_id DESC 
LIMIT 10;

-- Show recent transactions
SELECT transaction_id, user_id, reward_name, points_used, transaction_date 
FROM transaction 
ORDER BY transaction_id DESC 
LIMIT 10;
