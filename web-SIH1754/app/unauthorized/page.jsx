// pages/unauthorized.js

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Unauthorized</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center">You do not have permission to access this page.</p>
        <div className="mt-4 text-center">
          <Link href="/" passHref>
            <Button>Go to Home</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
