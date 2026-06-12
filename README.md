
*Loyiha oddiy bo‘lgani uchun barcha kod bitta faylga joylashtirilgan. Agar kerak bo‘lsa, CSS/JS alohida fayllarga ajratish tavsiya qilinadi.*

---

## 🧩 Asosiy funksiyalar

### 1. **Navbar 1**
- Qidiruv inputi (nomi, rang, uslub, kolleksiya bo‘yicha)
- Til tugmasi (UZ/RU)
- Dark mode tugmasi (🌙/☀️)
- Hisob (demo login)
- Savat (ko‘rish va to‘ldirish)
- Hamburger menyu (mobil)

### 2. **Navbar 2 – Dropdown menyular**
- **Wallpaper, Motifs, Styles, Colors, Rooms**  
- Ish rejimi:
  - **Sichqoncha** bilan hover qilganda ochiladi (CSS)
  - **Touch (mobil)** da bosish bilan ochiladi (JavaScript + CSS)

### 3. **Karusel**
- Avtomatik aylanish (3 soniya)
- Oldingi / keyingi tugmalar
- Dotlar orqali slayd tanlash

### 4. **Mahsulotlar grid**
- Barcha mahsulotlar dinamik yaratiladi (JavaScript)
- Filtr taglari (Barchasi, Minimalist, Living Room, Red...)
- Qidiruv filtr bilan birga ishlaydi
- Har bir kartada `+ Savatga qo‘shish`

### 5. **Bizning ishlarimiz** (portfolio)
- 6 ta chiroyli rasm (Lorem Picsum)

### 6. **Savat va buyurtma**
- Mahsulot sonini o‘zgartirish
- Umumiy summa hisoblash
- Buyurtma berish (ism, familiya, telefon, manzil)

### 7. **Admin panel**
- Yangi mahsulot qo‘shish (nomi, narxi, xona, rang, stil)
- Yangi slayd qo‘shish (rasm URL, xona, ranglar)

### 8. **Chat yordam**
- FAQ tugmalari (yetkazib berish, to‘lov, qaytarish)
- Foydalanuvchi ismini so‘rab, operatorga ulash imitatsiyasi

### 9. **Toast bildirishnomalar**
- Savatga qo‘shish, buyurtma, xatolik haqida

---

## 🎨 Ranglar va dark mode

- Asosiy accent rang: `#7c4dff` (binafsha)
- Light va dark tema CSS o‘zgaruvchilari orqali boshqariladi.
- Dark mode tugmasi bosilganda `<body class="dark">` qo‘shiladi.

---

## 📱 Responsivligi

- **Desktop** (keng > 900px): to‘liq navbar, 4-5 kolonka
- **Tablet** (640px – 900px): 2-3 kolonka, navbar2 ko‘rinadi
- **Mobil** (< 640px): navbar2 yashirinadi, hamburger menyu ishlaydi, grid 2 kolonka

---

## 🔧 Texnik tafsilotlar

- **Vanilla JavaScript** (hech qanday framework yoki kutubxona)
- **LocalStorage** – chat user ma’lumoti saqlanadi (demo)
- **Dinamik ma’lumotlar** – mahsulotlar va slaydlar JS arraylarida yaratiladi (42 ta mahsulot)
- **Drop menyular**:  
  ```css
  .nav2-item:hover .dropdown { display: block; }   /* hover */
  .nav2-item.open .dropdown { display: block; }   /* touch */
