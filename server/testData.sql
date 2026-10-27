USE expense_tracker;

INSERT INTO categories (name) VALUES 
('Software & Tools'),
('Cloud & Hosting'),
('Design & Media'),
('Marketing'),
('Hardware');

INSERT INTO payments (invoice_id, client, amount, status, category_id) VALUES
('INV-2026-001', 'Tech Solutions GmbH', 1250.00, 'Paid', 1),
('INV-2026-002', 'Max Mustermann', 149.99, 'Paid', 3),
('INV-2026-003', 'CloudProvider Inc.', 89.99, 'Paid', 2),
('INV-2026-004', 'Design Studio Blau', 450.00, 'Pending', 3),
('INV-2026-005', 'AdNetwork Media', 320.00, 'Paid', 4),
('INV-2026-006', 'Office Hardware Store', 1299.00, 'Paid', 5),
('INV-2026-007', 'GitHub Enterprise', 44.00, 'Paid', 1),
('INV-2026-008', 'AWS Server Hosting', 215.50, 'Pending', 2),
('INV-2026-009', 'Anna Schmidt', 75.50, 'Cancelled', 3),
('INV-2026-010', 'Local Coffee Shop', 45.00, 'Paid', 4),
('INV-2026-011', 'DevTools Pro', 199.00, 'Paid', 1),
('INV-2026-012', 'Vercel Deployment', 20.00, 'Paid', 2),
('INV-2026-013', 'Google Workspace', 72.00, 'Pending', 1),
('INV-2026-014', 'Logitech Mouse & Keyboard', 149.99, 'Paid', 5),
('INV-2026-015', 'Social Media Boost', 500.00, 'Cancelled', 4);
