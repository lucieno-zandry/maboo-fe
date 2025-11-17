import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { TabsContent } from "../ui/tabs";
import { useUserStore } from "~/hooks/use-user";
import z from "zod";
import Field from "../custom-components/field";

const dataFormat = {
    passwordFormat: z.string().min(4)
}

export default function () {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    const canSubmit = useMemo(() => formData.newPassword === formData.confirmPassword, [formData]);

    const handlePasswordChange: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        alert("Password changed successfully!");
        setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return <TabsContent value="security" className="space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Keep your account secure with a strong password</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <Field
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Enter current password"
                        label="Current Password"
                        dataFormat={dataFormat.passwordFormat} />

                    <Field
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        label="New Password"
                        dataFormat={dataFormat.passwordFormat} />

                    <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                        label="Confirm New Password"
                        dataFormat={dataFormat.passwordFormat} />
                    <Button type="submit" disabled={!canSubmit}>Update Password</Button>
                </form>
            </CardContent>
        </Card>
    </TabsContent>
}