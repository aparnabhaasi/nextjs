"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import TextFormInput from '@/components/from/TextFormInput';
import Link from "next/link";
import { Button, Card, CardBody, Col, Container, Row } from "react-bootstrap";

const SignIn = () => {
  const router = useRouter();
  const { register, handleSubmit, control } = useForm<{ username: string; password: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: { username: string; password: string }) => {
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/dashboards/analytics");
    }

    setLoading(false);
  };

  return (
    <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col xl={5}>
            <Card className="auth-card">
              <CardBody className="px-3 py-5">
                <h2 className="fw-bold text-uppercase text-center fs-18">Sign In</h2>
                <p className="text-muted text-center mt-1 mb-4">Enter your username and password to access admin panel.</p>
                <div className="px-4">
                  <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                    <TextFormInput
                      control={control}
                      placeholder="Enter your username"
                      className="bg-light bg-opacity-50 border-light py-2"
                      label="Username"
                      {...register("username", { required: true })} // No need to specify name separately
                    />
                    </div>
                    <div className="mb-3">
                    <TextFormInput
                      control={control}
                      placeholder="Enter your password"
                      className="bg-light bg-opacity-50 border-light py-2"
                      label="Password"
                      type="password"
                      {...register("password", { required: true })} // No need to specify name separately
                    />
                    </div>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <div className="mb-1 text-center d-grid">
                      <Button disabled={loading} className="btn btn-danger py-2 fw-medium" type="submit">
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                    </div>
                  </form>
                </div>
              </CardBody>
            </Card>
             
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignIn;
