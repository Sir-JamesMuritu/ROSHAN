<!-- import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { lovable } from "./integrations/lovable";
import { supabase } from "./integrations/supabase/client";

// Locally intercept Lovable's OAuth flow to resolve the /~oauth/initiate 404 error
lovable.auth.signInWithOAuth = async (provider, opts) => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: opts?.redirect_uri,
        queryParams: opts?.extraParams,
      },
    });

    if (error) {
      return { error };
    }
    
    return { redirected: true };
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }
};

createRoot(document.getElementById("root")!).render(<App />); -->
