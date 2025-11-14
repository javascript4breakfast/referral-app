import Image from "next/image";
import styles from "./page.module.css";

// app/page.tsx
export default function Home() {
  return (
    <main>
      <div>
        <h1>Referral App</h1>
        <p>
          Demo referral system built with Next.js, Prisma, and SQLite.
        </p>
        <div>
          <a href="/dashboard">
            Dashboard
          </a>
          <a href="/signup">
            Signup
          </a>
        </div>
      </div>
    </main>
    
  );
}