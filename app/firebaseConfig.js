// Firebase SDKをインポート
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase設定（あなたの設定を貼る）
const firebaseConfig = {
  apiKey: "AIzaSyC9PT5zEYYBrNZGFqwvplf75ho2-Z2qLis",
  authDomain: "mangahokanko-bd973.firebaseapp.com",
  projectId: "mangahokanko-bd973",
  storageBucket: "mangahokanko-bd973.firebasestorage.app",
  messagingSenderId: "459948905253",
  appId: "1:459948905253:web:964341a5816c867fa240cc",
  measurementId: "G-8QC1NCC89L"
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// 認証とFirestoreのインスタンスを取得
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
