import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <>
      <div className="flex justify-center items-center min-h-[100vh]">
        <Card className="flex flex-row w-full max-w-4xl p-4 space-x-6 ">
          <CardContent className="w-full flex flex-col  justify-center space-y-4 mt-3 ">
            <Label>Email</Label>
            <Input type="Text" placeholder="Email"></Input>
            <Label>Password</Label>
            <Input type="Password" placeholder="Password"></Input>
            <div className="w-full flex flex-col items-center justify-center space-y-4 mt-3">
              <Button>Register</Button>
              <Link to={"/auth/register"}>
                <Label>Don't have an account?</Label>
              </Link>
            </div>
          </CardContent>
          <CardContent className="flex  flex-col justify-center  max-w-md w-full space-y-3 py-3"></CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
