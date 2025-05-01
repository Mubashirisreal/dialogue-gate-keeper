
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function AppPage() {
  const { user, loading, signOut } = useAuth();
  
  useEffect(() => {
    if (user) {
      console.log("User is authenticated:", user);
      // Here you would redirect to your conversational agent application
      // Or you could pass the auth token to your application
    }
  }, [user]);

  // If no user is logged in and not loading, redirect to auth page
  if (!user && !loading) {
    return <Navigate to="/auth" />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we prepare your experience.</p>
        </div>
      </div>
    );
  }

  // This would be replaced with your redirect to your conversational agent application
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-6">Authentication Successful!</h1>
        <p className="mb-8">
          {user?.email ? (
            <>Welcome, <span className="font-medium">{user.email}</span>!</>
          ) : (
            <>Welcome to your application!</>
          )}
        </p>
        <p className="mb-8 text-muted-foreground">
          You are now authenticated. This is where you would be redirected to your conversational agent application.
        </p>
        <Button onClick={signOut} variant="outline">Sign Out</Button>
      </div>
    </div>
  );
}
