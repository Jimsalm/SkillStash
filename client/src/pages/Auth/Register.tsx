import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { authService } from "@/services/authService";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");

  const handleRegister = async (e: any) => {
    e.preventDefault();
    if (password != confirmPass) {
      return console.log("Password has to match");
    }

    const registeredData = await authService.registerUser({
      name,
      email,
      password,
    });
    console.log(registeredData);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-[100vh]">
        <Card className="flex flex-row w-full max-w-4xl p-4 space-x-6 ">
          <CardContent className="flex-[1]  "></CardContent>
          <CardContent className="flex  flex-col justify-center max-w-md w-full space-y-3 py-3">
            <form
              onSubmit={handleRegister}
              className="flex flex-col  space-y-3"
            >
              <Label>Name</Label>
              <Input
                type="Text"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              ></Input>
              <Label>Email</Label>
              <Input
                type="Text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
              <Label>Password</Label>
              <Input
                type="Password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
              <Label>Confirm Password</Label>
              <Input
                type="Password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPass(e.target.value)}
              ></Input>
              <div className="w-full flex flex-col items-center justify-center space-y-4 mt-3">
                <Button type="submit">Register</Button>
                <Link to={"/auth/login"}>
                  <Label>Already have an account?</Label>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Register;
