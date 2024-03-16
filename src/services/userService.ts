const signUp = async <PayloadType>(payload: PayloadType) => {
  console.log(payload);
  return 'Successfull Sign Up';
};

export default { signUp };
