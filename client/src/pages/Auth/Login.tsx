import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { loginSchema, type LoginInput } from "@/lib/schemas/authSchema";
import { useAuth } from "@/components/admin/AuthContext"

const Login = () => {
  const navigate = useNavigate();
  const { loginAction } = useAuth();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await loginAction(values);
  }

  return (
    <div className="flex justify-center items-center min-h-[100vh]">
      <Card className="flex flex-row w-full max-w-4xl p-4 space-x-6 shadow-lg border-0">
        
        {/* Left Side */}
        <CardContent className="w-full flex flex-col justify-center space-y-4 mt-3 hidden md:flex bg-primary/5 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-primary">Welcome Back</h2>
          <p className="text-muted-foreground">
            Log in to access your saved courses and continue learning.
          </p>
        </CardContent>

        {/* Right Side */}
        <CardContent className="flex flex-col justify-center max-w-md w-full space-y-6 py-3">
          <div className="mb-2">
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">Don't have an account? </span>
            <Link to={"/auth/register"} className="text-sm text-primary hover:underline font-medium">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;