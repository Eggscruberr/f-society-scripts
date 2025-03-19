
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlitchText from '@/components/GlitchText';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Shield, Lock, Key } from 'lucide-react';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// If this were a real application, this would be securely stored server-side
const SECRET_PASSWORD = 'fsociety123';

const formSchema = z.object({
  password: z.string().min(1, { message: 'Password is required' })
});

const Panel = () => {
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.password === SECRET_PASSWORD) {
      toast({
        title: "Access Granted",
        description: "Redirecting to secure panel...",
        variant: "default",
      });
      
      // In a real app, we would redirect to a server route, but for this demo
      // we'll simulate by redirecting to a new route
      setTimeout(() => {
        navigate('/panel-access');
      }, 1500);
    } else {
      setAttempts(attempts + 1);
      
      toast({
        title: "Access Denied",
        description: `Invalid password. Attempt ${attempts + 1}/3`,
        variant: "destructive",
      });
      
      // Show hint after 3 failed attempts
      if (attempts >= 2) {
        setShowHint(true);
      }
      
      form.reset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-fsociety-darker pt-16">
      <div className="container max-w-md mx-auto px-4 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <Shield className="w-16 h-16 mx-auto mb-4 text-fsociety-primary" />
          <GlitchText 
            text="SECURE PANEL ACCESS" 
            className="text-2xl font-mono font-bold text-fsociety-primary"
            variant="slow"
          />
          <p className="text-gray-400 mt-2 font-mono text-sm">AUTHORIZATION REQUIRED</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="border-fsociety-primary/20 bg-fsociety-secondary/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-fsociety-primary font-mono flex items-center gap-2">
                <Lock className="h-5 w-5" /> Restricted Area
              </CardTitle>
              <CardDescription className="font-mono text-gray-400">
                Enter the secret password to proceed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 font-mono text-xs">SECRET PASSWORD</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fsociety-primary/70 h-4 w-4" />
                            <Input 
                              placeholder="Enter password" 
                              type="password" 
                              className="pl-10 bg-fsociety-darker border-fsociety-primary/30 font-mono" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-fsociety-error" />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full font-mono bg-fsociety-primary text-black hover:bg-fsociety-accent"
                  >
                    AUTHENTICATE
                  </Button>
                </form>
              </Form>
              
              {showHint && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-3 border border-fsociety-primary/20 rounded bg-fsociety-muted"
                >
                  <p className="text-xs font-mono text-gray-400">
                    <span className="text-fsociety-primary">HINT:</span> The password follows the pattern of "organization" + "number".
                    Think about the name of the hacker collective from Mr. Robot.
                  </p>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="border-t border-fsociety-primary/10 pt-4 flex justify-between">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 font-mono text-xs hover:text-fsociety-primary"
              >
                RETURN TO DASHBOARD
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowHint(!showHint)}
                className="text-gray-400 font-mono text-xs hover:text-fsociety-primary"
              >
                {showHint ? 'HIDE HINT' : 'NEED A HINT?'}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Panel;
