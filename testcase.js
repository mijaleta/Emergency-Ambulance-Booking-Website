describe('Password Reset Route', () => {
  it('should reset password successfully', async () => {
    // Existing user with a valid token
    const user = new User({
      // Mock user data
      username: 'testuser',
      email: 'testuser@example.com',
      password: await bcrypt.hash('oldpassword', 10),
      resetPasswordToken: 'validtoken',
      resetPasswordExpires: Date.now() + 3600000, // 1 hour from now
    });
    await user.save();

    const newPassword = 'newpassword';
    const confirmPassword = 'newpassword';

    const response = await request(app)
      .post('/auth/reset-password/validtoken')
      .send({
        password: newPassword,
        confirmPassword: confirmPassword
      });

    expect(response.status).toBe(302); // Assuming a redirect status code
    expect(response.header['location']).toBe('/login'); // Assuming redirect location is '/login'

    // Verify that the password is updated in the database
    const updatedUser = await User.findById(user._id);
    const passwordMatch = await bcrypt.compare(newPassword, updatedUser.password);
    expect(passwordMatch).toBe(true);

    // Verify that reset token is removed
    expect(updatedUser.resetPasswordToken).toBeUndefined();
    expect(updatedUser.resetPasswordExpires).toBeUndefined();
  });

  it('should return an error if passwords do not match', async () => {
    // Existing user with a valid token
    const user = new User({
      // Mock user data
      username: 'testuser',
      email: 'testuser@example.com',
      password: await bcrypt.hash('oldpassword', 10),
      resetPasswordToken: 'validtoken',
      resetPasswordExpires: Date.now() + 3600000, // 1 hour from now
    });
    await user.save();

    const newPassword = 'newpassword';
    const confirmPassword = 'password'; // Different password here

    const response = await request(app)
      .post('/auth/reset-password/validtoken')
      .send({
        password: newPassword,
        confirmPassword: confirmPassword
      });

    expect(response.status).toBe(400); // Assuming a 400 status code for password mismatch
    expect(response.text).toBe('Passwords do not match'); // Assuming the error message is sent as plain text
  });

  // Add more test cases for other scenarios
});
