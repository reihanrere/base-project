Tentu, ini adalah README.md yang telah diperbarui, lebih rapi, dan profesional dalam bahasa Indonesia:

# Base Project NestJS

## Deskripsi

Repositori pemula TypeScript untuk kerangka kerja [Nest](https://github.com/nestjs/nest). Proyek ini menyediakan dasar yang kokoh untuk membangun aplikasi sisi server yang kuat dan terukur, lengkap dengan manajemen pengguna dan peran, otentikasi, dan dokumentasi API.

## Fitur Utama

* **Manajemen Pengguna & Peran**: Sistem CRUD lengkap untuk pengguna dan peran.
* **Otentikasi**: Otentikasi berbasis JWT yang aman.
* **Database**: Menggunakan Prisma sebagai ORM untuk interaksi database yang mudah.
* **Validasi**: Validasi input yang kuat menggunakan Zod.
* **Dokumentasi API**: Dokumentasi API otomatis dibuat menggunakan Swagger.
* **Logging**: Pencatatan log yang terstruktur dengan Winston.
* **Konfigurasi**: Manajemen konfigurasi yang fleksibel.

## Teknologi yang Digunakan

* [NestJS](https://nestjs.com/)
* [Prisma](https://www.prisma.io/)
* [PostgreSQL](https://www.postgresql.org/)
* [JWT (JSON Web Tokens)](https://jwt.io/)
* [Swagger](https://swagger.io/)
* [Winston](https://github.com/winstonjs/winston)
* [Zod](https://zod.dev/)
* [TypeScript](https://www.typescriptlang.org/)

## Persiapan Proyek

1.  **Kloning Repositori**

    ```bash
    $ git clone https://github.com/reihanrere/base-project.git
    $ cd base-project
    ```

2.  **Instalasi Dependensi**

    ```bash
    $ npm install
    ```

3.  **Pengaturan Lingkungan**
    Buat file `.env` di direktori root dan tambahkan variabel lingkungan yang diperlukan, seperti koneksi database.

    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
    SECRET_KEY="kunci_rahasia_anda"
    ```

4.  **Migrasi Database**
    Jalankan migrasi Prisma untuk membuat skema database.

    ```bash
    $ npx prisma migrate dev --name init
    ```

## Menjalankan Aplikasi

* **Mode Pengembangan**

  ```bash
  # Dengan fitur watch
  $ npm run start:dev
  ```

* **Mode Produksi**

  ```bash
  # Build proyek
  $ npm run build

  # Jalankan dari direktori dist
  $ npm run start:prod
  ```

## Menjalankan Tes

* **Unit Tests**

  ```bash
  $ npm run test
  ```

* **End-to-End (E2E) Tests**

  ```bash
  $ npm run test:e2e
  ```

* **Test Coverage**

  ```bash
  $ npm run test:cov
  ```

## Dokumentasi API

Setelah aplikasi berjalan, dokumentasi API (Swagger) dapat diakses di:
`http://localhost:3000/api-docs` (atau port yang Anda gunakan)