import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterInput } from "@/lib/schemas/authSchema";
import { useAuth } from "@/components/admin/AuthContext";
import { toast } from "sonner";

const Register = () => {

  const navigate = useNavigate();
  const { registerAction } = useAuth();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    await registerAction(values)
  }


  return (
    <div className="flex justify-center items-center min-h-[100vh]">
      <Card className="flex flex-row w-full max-w-4xl p-4 space-x-6 shadow-lg border-0">
        
        {/* Left Side */}
        <CardContent className="flex-[1] bg-primary/5 rounded-xl hidden md:flex items-center justify-center">
           <div className="text-center">
              <h2 className="text-2xl font-bold text-primary">Join SkillStash</h2>
              <p className="text-muted-foreground">Start your learning journey today.</p>
           </div>
        </CardContent>

        {/* Right Side */}
        <CardContent className="flex flex-col justify-center max-w-md w-full space-y-6 py-3">
          <div className="mb-2">
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-sm text-muted-foreground">Enter your details below</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="James Maglolona" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm Password" type="password" {...field} />
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
                {form.formState.isSubmitting ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">Already have an account? </span>
            <Link to={"/auth/login"} className="text-sm text-primary hover:underline font-medium">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
