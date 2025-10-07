# KKU Social App

**ชื่อ:นายจารุวิทย์ แสงแก้วสิริกุล รหัสนักศึกษา 653450086-7**

โปรเจกต์นี้เป็นแอปตัวอย่างที่พัฒนาด้วย **Expo + React Native (TypeScript)** เพื่อเชื่อมต่อกับ **CIS KKU Classroom API** และแสดงข้อมูลในรูปแบบโซเชียล เช่น การโพสต์สถานะ แสดงความคิดเห็น และดูรายชื่อสมาชิกในชั้นปี

---

## ฟังก์ชันหลัก

1. **ฟังก์ชันล็อกอินเข้าสู่ระบบ**
   - เข้าสู่ระบบด้วยอีเมลและรหัสผ่านจากระบบ CIS KKU  
   - ใช้ API `/signin`

2. **ฟังก์ชันดูสมาชิกในชั้นปี**
   - แสดงรายชื่อสมาชิกตามปีที่เข้าศึกษา  
   - ตัวอย่าง API  
     ```bash
     curl -X 'GET' \
     'https://cis.kku.ac.th/api/classroom/class/2565' \
     -H 'accept: application/json'
     ```

3. **ฟังก์ชันโพสต์สถานะ**
   - ผู้ใช้สามารถโพสต์ข้อความสถานะได้

4. **ฟังก์ชันคอมเมนต์สถานะ**
   - แสดงความคิดเห็นในโพสต์ของตนเองหรือผู้อื่น

5. **ฟังก์ชัน Like / Unlike สถานะ**
   - สามารถกดถูกใจหรือยกเลิกถูกใจโพสต์ได้

---

## หน้าตาแอปพลิเคชัน
- หน้า **Login**
- หน้า **Main (Home)**
- หน้า **Feed**
- หน้า **Members**
- หน้า **Profile**

---

## การติดตั้ง

```bash
npx create-expo-app kku-social
cd kku-social
ติดตั้งแพ็กเกจหลัก
bash
Copy code
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install axios
npm install @expo/vector-icons
การรันโปรแกรม
bash
Copy code
npx expo start -c
เปิดบน Expo Go (มือถือ) หรือรันใน Emulator (Android / iOS) ได้ทันที
