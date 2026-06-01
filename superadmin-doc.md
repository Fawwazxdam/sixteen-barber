Superadmin & Subscription Transactions API Documentation
Semua endpoint di bawah ini sudah dilindungi (protected). Pengguna harus login (menyertakan cookie access_token). Khusus untuk rute /superadmin dan /subscription-transactions/all serta /:id/status, pengguna yang login harus memiliki email yang cocok dengan variabel SUPERADMIN_EMAIL di file .env backend.

🏛️ Subscription Transactions (Untuk Barbershop / Tenant)
1. Buat Pengajuan Pembayaran
POST /subscription-transactions Digunakan oleh owner barbershop setelah mereka mentransfer uang untuk mengunggah bukti bayar.

Headers: Cookie: access_token=<token>

Request Body:

json
{
  "planId": "uuid-dari-tabel-plans",
  "amount": 99000,
  "paymentProofUrl": "/uploads/bukti-transfer-123.jpg",
  "notes": "Sudah ditransfer dari BCA a.n Adam"
}
Response (201 Created):

json
{
  "message": "Transaction created successfully",
  "transaction": {
    "id": "uuid-transaksi",
    "tenantId": "uuid-tenant",
    "planId": "uuid-plan",
    "amount": 99000,
    "status": "pending",
    "paymentProofUrl": "/uploads/bukti-transfer-123.jpg"
  }
}
2. Lihat Riwayat Tagihan Sendiri
GET /subscription-transactions/my-transactions Menampilkan semua riwayat pembayaran langganan milik barbershop yang sedang login.

Headers: Cookie: access_token=<token>

Response (200 OK):

json
[
  {
    "id": "uuid-transaksi",
    "planId": "uuid-plan",
    "amount": 99000,
    "status": "pending",
    "paymentProofUrl": "...",
    "createdAt": "2026-05-24T14:00:00.000Z"
  }
]
👑 Super Admin Endpoints (Hanya Untuk Pengelola SaaS)
3. Ambil Semua Transaksi Masuk
GET /subscription-transactions/all Menampilkan seluruh transaksi dari semua barbershop (Berguna untuk melihat mana yang masih pending).

Response (200 OK):

json
[
  {
    "id": "uuid-transaksi",
    "tenantId": "uuid-tenant",
    "planId": "uuid-plan",
    "amount": 99000,
    "status": "pending",
    "createdAt": "2026-05-24T14:00:00.000Z"
  }
]
4. Setujui / Tolak Pembayaran
PUT /subscription-transactions/:id/status Mengeksekusi persetujuan. Jika status diubah ke approved, sistem otomatis memperpanjang atau membuat subscription aktif baru untuk barbershop tersebut.

Request Body:

json
{
  "status": "approved", // atau "rejected"
  "notes": "Pembayaran valid, terima kasih"
}
Response (200 OK):

json
{
  "message": "Transaction updated successfully",
  "transaction": {
    "id": "uuid-transaksi",
    "status": "approved"
  }
}
5. Statistik Dashboard Superadmin
GET /superadmin/stats Mengembalikan data ringkasan untuk grafik/informasi di beranda halaman Super Admin.

Response (200 OK):

json
{
  "totalTenants": 12,
  "activeTenants": 10,
  "pendingTransactions": 3,
  "totalRevenue": 2500000
}
6. Daftar Semua Barbershop
GET /superadmin/tenants Mengembalikan semua barbershop beserta informasi apakah langganan mereka masih aktif atau tidak.

Response (200 OK):

json
[
  {
    "id": "uuid-tenant",
    "name": "Barbershop A",
    "isActive": true,
    "subscription": {
      "planName": "Premium Plan",
      "endsAt": "2026-06-24T14:00:00.000Z",
      "status": "active"
    }
  }
]
7. Blokir Barbershop (Suspend)
PUT /superadmin/tenants/:id/suspend Mematikan akses barbershop (Mengubah isActive menjadi false).

Response (200 OK):

json
{
  "message": "Tenant suspended successfully"
}
8. Aktifkan Barbershop (Activate)
PUT /superadmin/tenants/:id/activate Mengembalikan akses barbershop (Mengubah isActive menjadi true).

Response (200 OK):

json
{
  "message": "Tenant activated successfully"
}