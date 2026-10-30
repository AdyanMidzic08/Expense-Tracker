USE expense_tracker;

-- Test-Nutzer anlegen (Passwort ist z.B. Hash für 'Password123!')
INSERT INTO users (id, email, password) VALUES 
(1, 'testuser@example.com', 'Password123!')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO categories (id, user_id, name) VALUES 
(1, 1, 'Software & Tools'),
(2, 1, 'Cloud & Hosting'),
(3, 1, 'Design & Media'),
(4, 1, 'Marketing'),
(5, 1, 'Hardware')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO payments (id, user_id, invoice_id, client, amount, status, category_id) VALUES
(1, 1, 'INV-2026-001', 'Tech Solutions GmbH', 1250.00, 'Paid', 1),
(2, 1, 'INV-2026-002', 'Max Mustermann', 149.99, 'Paid', 3),
(3, 1, 'INV-2026-003', 'CloudProvider Inc.', 89.99, 'Paid', 2),
(4, 1, 'INV-2026-004', 'Design Studio Blau', 450.00, 'Pending', 3),
(5, 1, 'INV-2026-005', 'AdNetwork Media', 320.00, 'Paid', 4),
(6, 1, 'INV-2026-006', 'Office Hardware Store', 1299.00, 'Paid', 5),
(7, 1, 'INV-2026-007', 'GitHub Enterprise', 44.00, 'Paid', 1),
(8, 1, 'INV-2026-008', 'AWS Server Hosting', 215.50, 'Pending', 2),
(9, 1, 'INV-2026-009', 'Anna Schmidt', 75.50, 'Cancelled', 3),
(10, 1, 'INV-2026-010', 'Local Coffee Shop', 45.00, 'Paid', 4),
(11, 1, 'INV-2026-011', 'DevTools Pro', 199.00, 'Paid', 1),
(12, 1, 'INV-2026-012', 'Vercel Deployment', 20.00, 'Paid', 2),
(13, 1, 'INV-2026-013', 'Google Workspace', 72.00, 'Pending', 1),
(14, 1, 'INV-2026-014', 'Logitech Mouse & Keyboard', 149.99, 'Paid', 5),
(15, 1, 'INV-2026-015', 'Social Media Boost', 500.00, 'Cancelled', 4)
ON DUPLICATE KEY UPDATE client=VALUES(client);
