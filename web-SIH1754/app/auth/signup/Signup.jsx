import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      email,
      password,
      name,
      phone,
      designation,
      state: selectedState,
      district: selectedDistrict,
      pincode,
      branch: selectedBranch,
    };

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful!");

        // Redirect to the correct page based on designation
        if (data.designation === "DistrictManager") {
          router.push("/districthead");
        } else if (data.designation === "BranchManager") {
          router.push("/fieldmaster");
        }
      } else {
        alert(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="grid gap-4 max-w-md mx-auto">
      <div className="grid gap-2">
        <Label>Email</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="grid gap-2">
        <Label>Password</Label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div className="grid gap-2">
        <Label>Name</Label>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="grid gap-2">
        <Label>Phone</Label>
        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>

      <div className="grid gap-2">
        <Label>Designation</Label>
        <Select onValueChange={setDesignation} value={designation}>
          <SelectTrigger>
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

      {designation === "DistrictManager" && (
        <>
          <div className="grid gap-2">
            <Label>State</Label>
            <Input
              type="text"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              placeholder="Enter state"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>District</Label>
            <Input
              type="text"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              placeholder="Enter district"
              required
            />
          </div>
        </>
      )}

      {designation === "BranchManager" && (
        <>
          <div className="grid gap-2">
            <Label>Pincode</Label>
            <Input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter pincode"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Branch</Label>
            <Input
              type="text"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              placeholder="Enter branch"
              required
            />
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  );
}
