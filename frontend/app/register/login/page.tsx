// Login page for mentor users. Composes the authentication form with the registration flow layout.
"use client";

import React from "react";
import Link from "next/link";
import TabsLogin from "@/components/tabs-login";
import BackHome from "@/components/buttons/back";

export default function Login() {
  return (
    <div className="w-full overflow-x-clip">
      <div className="absolute left-0 top-0">
        <BackHome />
      </div>

      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="flex flex-col md:flex-row w-full max-w-3xl">
          <section className="bg-primary m-1 flex flex-col rounded-lg items-center justify-center md:w-1/2 p-6 text-white">
            <img
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=180,fit=crop,q=95/dOq4lP0kVLiEl8Z3/lideranaas-empaticas-logo-AoPWG9oBrrt3QGv0.png"
              alt="logo lideranças empáticas"
              className="mb-6 w-28 md:w-36"
            />
            <p className="mb-1 text-sm">É aluno e não tem cadastro?</p>
            <Link
              href="/register/sign-up"
              className="bg-background text-black px-4 py-1 font-medium hover:bg-background/70 mb-4 rounded"
            >
              Cadastre-se
            </Link>
            <p className="text-center text-sm max-w-[220px]">
              Registre-se com seus dados institucionais para utilizar os
              recursos do site.
            </p>
          </section>

          <section className="flex flex-col justify-center md:w-1/2">
            <TabsLogin />
          </section>
        </div>
      </div>
    </div>
  );
}
