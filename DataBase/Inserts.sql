-- Active: 1746130779175@@127.0.0.1@3306@e_commerce
INSERT INTO e_commerce.roles (nom_rol,fot_rol) VALUES
('Administrador','https://imgs.search.brave.com/JheS1cTjYH1Y1E7rp1FADfQDL9uXw20FxZAFfjZwEaY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9k/L2Q0L04uVGVzbGEu/SlBH'),
('Veterinario','https://imgs.search.brave.com/rL6dnhwCDXLvz02lsRs2QjVj1F8o-8D0o4pTYhmHah8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9jL2M4L01h/cmllX0N1cmllX2Mu/XzE5MjBzLmpwZy81/MTJweC1NYXJpZV9D/dXJpZV9jLl8xOTIw/cy5qcGc'),
('Usuario','https://imgs.search.brave.com/kWZPq0vRV5Hl9y9RS9CtH5o-SRhsHFZfA8twL1VUavI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9oaXBz/LmhlYXJzdGFwcHMu/Y29tL2htZy1wcm9k/L2ltYWdlcy9nZXR0/eWltYWdlcy02MTUz/MTI2MzQuanBnP2Ny/b3A9MXh3OjEuMHho/O2NlbnRlcix0b3Am/cmVzaXplPTY0MDoq');
INSERT INTO e_commerce.personas (nom_per, ape_per, fec_nac_per, tip_doc_per, doc_per, dir_per, cel_per, cel2_per, email_per, cont_per,gen_per) VALUES
('Juan', 'Pérez',NOW(), 'CC', '123450989', 'Calle 123 #45-67', '3001234567', NULL, 'juanperez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Masculino'),
('María', 'Gómez',NOW(), 'CC', '876254321', 'Av. Principal #12-34', '3102345678', '3203456789', 'mariagomez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Femenino'),
('Carlos', 'Rodríguez',NOW(), 'CE', '091234456', 'Carrera 56 #78-90', '3154567890', NULL, 'carlosrod@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Masculino'),
('Ana', 'Martínez',NOW(), 'CC', '112230944', 'Diagonal 34 #56-78', '3175678901', NULL, 'anamartinez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Femenino'),
('Luis', 'García',NOW(), 'TI', '987654092', 'Transversal 12 #34-56', '3186789012', '3197890123', 'luisgarcia@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Masculino');
INSERT INTO e_commerce.otorgar_roles (id_rol, id_per) VALUES
(1,1),
(2,1),
(3,1),
(1,2),
(2,2),
(3,2),
(1,3),
(2,3),
(3,3),
(2,4),
(1,5),
(2,5),
(3,5);