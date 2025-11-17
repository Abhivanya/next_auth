"use server";

export const loginAction = async (formData: FormData) => {
  const body = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  return res.json();
};
