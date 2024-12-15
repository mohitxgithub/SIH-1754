"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { auth, db } from "@/FirebaseConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [pincode, setPincode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [postOffices, setPostOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch post offices based on pincode
  const fetchPostOffices = async () => {
    if (pincode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (data[0]?.Status === "Success") {
          setPostOffices(data[0].PostOffice || []);
        } else {
          setPostOffices([]);
          alert("Invalid pincode. No post offices found.");
        }
      } catch (error) {
        console.error("Error fetching post offices:", error);
        alert("Failed to fetch post offices. Please try again.");
      }
    } else {
      alert("Please enter a valid 6-digit pincode.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, `users/web/${designation}`, user.uid);

      const userData = {
        email,
        designation,
        ...(designation === "BranchManager" && { pincode, branchName }),
        ...(designation === "DistrictManager" && { state, district }),
      };

      await setDoc(userDocRef, userData);
      Cookies.set("user", JSON.stringify(userData), { expires: 7 });

      alert("Signup successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="designation">Designation</Label>
            <Select onValueChange={setDesignation} value={designation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="DistrictManager">District Manager</SelectItem>
                  <SelectItem value="BranchManager">Branch Manager</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {designation === "BranchManager" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                <Button type="button" onClick={fetchPostOffices} className="w-full mt-2">
                  Fetch Post Offices
                </Button>
              </div>

              {postOffices.length > 0 && (
                <div className="grid gap-2">
                  <Label htmlFor="branchName">Select Branch</Label>
                  <Select onValueChange={setBranchName} value={branchName}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {postOffices.map((office, index) => (
                        <SelectItem key={index} value={office.Name}>
                          {office.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {designation === "DistrictManager" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" type="text" value={state} onChange={(e) => setState(e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" type="text" value={district} onChange={(e) => setDistrict(e.target.value)} required />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
