import { NextResponse } from "next/server";
import { auth, db } from "@/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { email, password, name, phone, designation, state, district, pincode, branch } = await req.json();

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a reference to the user's document in the "users" collection
    const userDocRef = doc(db, "users", user.uid);

    // Store additional user data in Firestore
    await setDoc(userDocRef, {
      uid: user.uid,
      email,
      name,
      phone,
      designation,
      state,
      district,
      pincode,
      branch,
      createdAt: new Date(),
    });

    // Return the designation to be used for redirection
    return NextResponse.json(
      { message: "User signed up successfully!", designation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
