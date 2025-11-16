'use client';
import { ProgressCircle } from "@adobe/react-spectrum";
import styles from './styles/redirect-loader.module.css';

export default function RedirectLoader() {
  return (
    <div className={styles.redirectLoaderWrapper}>
        <div>
            <ProgressCircle aria-label="Loading…" isIndeterminate size="L" />
        </div>
        <div>
            <p>Redirecting to dashboard…</p>
        </div>
    </div>
  );
};