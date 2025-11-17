import Button from "~/components/custom-components/button"
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "~/components/ui/field"
import CustomField from "~/components/custom-components/field";
import z from "zod";
import { redirect, useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types";
import { getEmailInfo, registerUser } from "~/api/http-requests";
import React, { useMemo, useState, type FormEventHandler } from "react";
import getUpdatedFormErrors from "~/lib/get-updated-form-errors";
import randomString from "~/lib/random-string";
import { toast } from "sonner";
import { AppFetchException } from "~/api/app-fetch";

const dataFormat = {
  password: z.string().min(4),
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const response = email && await getEmailInfo(email);

  if (response && response.data?.is_taken === false) {
    return email;
  }

  return redirect('/auth');
}

export default function () {
  const email = useLoaderData<string>();

  const [formValidationErrors, setFormValidationErrors] = useState<{ password?: string[], password_confirmation?: string[] } | null>(null);

  const [data, setData] = useState({
    password: '',
    password_confirmation: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const canSubmit = useMemo(() => !formValidationErrors && data.password && data.password === data.password_confirmation, [formValidationErrors, data]);
  const navigate = useNavigate();

  const handleValidationErrorsChange = React.useCallback((validationErrors: string[] | null, e: React.FocusEvent<HTMLInputElement, Element>) => {
    const name = e.target.name as "password" | "password_confirmation";


    setFormValidationErrors(f => {
      const updatedFormErrors = getUpdatedFormErrors({
        formErrors: f,
        name,
        validationErrors
      })

      return updatedFormErrors
    });

    setData(d => ({ ...d, [name]: e.target.value }));
  }, []);


  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    registerUser({
      email: formData.get("email")!,
      password: formData.get("password")!,
      password_confirmation: formData.get("password_confirmation")!,
      name: randomString(8),
    })
      .then(response => {
        toast.success("Register successful!");

        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }

        navigate('/auth/verify-email');
      })
      .catch(error => {
        if (error instanceof AppFetchException) {
          return setFormValidationErrors(error.errors);
        }

        toast.error(`Failed to register : ${error.status}`, { description: error.data.message });
      })
      .finally(() => setIsLoading(false));
  }

  return <form className="p-6 md:p-8" method="post" onSubmit={handleSubmit}>
    <FieldGroup>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Welcome!</h1>
        <p className="text-muted-foreground text-balance">
          Create an account for free
        </p>
      </div>

      <CustomField
        label="Email"
        id="email"
        type="email"
        name="email"
        value={email}
        readOnly
        required
      />

      <CustomField
        id="password"
        type="password"
        name="password"
        dataFormat={dataFormat.password}
        onValidationErrorsChange={handleValidationErrorsChange}
        validationErrors={formValidationErrors?.password}
        label="Password"
        required />

      <CustomField
        id="password_confirmation"
        type="password"
        name="password_confirmation"
        dataFormat={dataFormat.password}
        onValidationErrorsChange={handleValidationErrorsChange}
        validationErrors={formValidationErrors?.password_confirmation}
        label="Confirm your password"
        required />

      <Field>
        <Button
          type="submit"
          disabled={!canSubmit}
          isLoading={isLoading}>Login</Button>
      </Field>

      <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
        Or continue with
      </FieldSeparator>
      <Field className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          <span className="sr-only">Login with Google</span>
        </Button>
        <Button variant="outline" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
              fill="currentColor"
            />
          </svg>
          <span className="sr-only">Login with Meta</span>
        </Button>
      </Field>
    </FieldGroup>
  </form>
}
