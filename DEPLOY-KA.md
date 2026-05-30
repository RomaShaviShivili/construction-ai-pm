# სამუდამო გამოქვეყნება — ნაბიჯ-ნაბიჯ (Vercel + Render)

საიტი 2 ნაწილად იტვირთება:
- **Frontend** (გვერდი) → Vercel — ყველას ეს ლინკი გაუზიარებ
- **Backend** (API + AI) → Render — უკანა ფონი

---

## ნაბიჯი 1: GitHub-ზე ატვირთვა

### 1.1 GitHub ანგარიში
გადადი: https://github.com და შექმენი ანგარიში (თუ არ გაქვს).

### 1.2 ახალი რეპოზიტორი
1. **New repository**
2. სახელი: `construction-ai-pm`
3. **Public** აირჩიე
4. **Create repository**

### 1.3 კოდის ატვირთვა

**ვარიანტი A — GitHub Desktop (უმარტივესი):**
1. ჩამოტვირთე: https://desktop.github.com
2. **File → Add local repository** → აირჩიე `C:\Users\HP\construction-ai-pm`
3. **Publish repository** → GitHub-ზე ატვირთვა

**ვარიანტი B — ტერმინალი:**
```powershell
cd C:\Users\HP\construction-ai-pm
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SHEN_TAVISI/construction-ai-pm.git
git push -u origin main
```
(`SHEN_TAVISI` შეცვალე შენი GitHub მომხმარებლის სახელით)

---

## ნაბიჯი 2: Backend — Render.com

### 2.1 რეგისტრაცია
https://render.com → **Get Started** → **Sign in with GitHub**

### 2.2 ახალი Web Service
1. **New +** → **Web Service**
2. აირჩიე `construction-ai-pm` რეპო
3. პარამეტრები:

| ველი | მნიშვნელობა |
|------|-------------|
| Name | `construction-ai-pm-api` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | **Free** |

### 2.3 Environment Variables (Environment)
დაამატე:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | შენი OpenAI გასაღები (`sk-...`) |
| `FRONTEND_URL` | ჯერ ცარიელი — Vercel-ის შემდეგ შეავსებ |

### 2.4 Deploy
**Create Web Service** → დაელოდე 2–5 წუთი.

Backend მისამართი იქნება მსგავსი:
```
https://construction-ai-pm-api.onrender.com
```

**შეინახე ეს URL** — Vercel-ზე დაგჭირდება.

---

## ნაბიჯი 3: Frontend — Vercel.com

### 3.1 რეგისტრაცია
https://vercel.com → **Sign Up** → **Continue with GitHub**

### 3.2 ახალი პროექტი
1. **Add New → Project**
2. აირჩიე `construction-ai-pm`
3. პარამეტრები:

| ველი | მნიშვნელობა |
|------|-------------|
| Framework Preset | Vite |
| Root Directory | `frontend` (Edit → აირჩიე frontend) |

### 3.3 Environment Variables
**Environment Variables** სექციაში დაამატე:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://construction-ai-pm-api.onrender.com/api` |

⚠️ შეცვალე `construction-ai-pm-api` შენი Render სერვისის სახელით + `/api` ბოლოში.

### 3.4 Deploy
**Deploy** → 1–2 წუთი.

Frontend მისამართი:
```
https://construction-ai-pm.vercel.app
```

**ეს ლინკი გაუზიარე ყველას.**

---

## ნაბიჯი 4: Render-ზე FRONTEND_URL განახლება

1. Render → შენი სერვისი → **Environment**
2. `FRONTEND_URL` = `https://construction-ai-pm.vercel.app` (შენი Vercel ლინკი)
3. **Save Changes** → ავტომატურად გადაიტვირთება

---

## შემოწმება

1. გახსენი Vercel ლინკი ბრაუზერში
2. უნდა ჩანდეს პროექტები
3. **AI რისკის ანალიზი** — უნდა მუშაობდეს
4. ჩატი — ქართული პასუხები

---

## ⚠️ Render Free tier — მნიშვნელოვანი

უფასო Render სერვისი **15 წუთის** უმოქმედობის შემდეგ „იძინებს“.

- პირველი მოთხოვნა **30–60 წამს** გრძელდება
- შემდეგ ჩვეულებრივ მუშაობს

თუ გინდა ყოველთვის ჩართული — Render-ზე გადაიხადე (~$7/თვე).

---

## კოდის განახლება (მომავალში)

```powershell
git add .
git commit -m "განახლება"
git push
```

Vercel და Render ავტომატურად განაახლებენ საიტს.

---

## პრობლემები

| პრობლემა | გამოსავალი |
|----------|------------|
| „API-სთან ვერ დავუკავშირდი“ | შეამოწმე `VITE_API_URL` Vercel-ზე, `/api` ბოლოში |
| AI არ მუშაობს | Render-ზე `OPENAI_API_KEY` სწორია? |
| ნელია პირველი ჩატვირთვა | Render free tier — ელოდე 1 წუთი |

---

## შეჯამება

```
GitHub (კოდი)
    ├── Render  → Backend API  (construction-ai-pm-api.onrender.com)
    └── Vercel  → Frontend     (construction-ai-pm.vercel.app)  ← ეს გაუზიარე
```
