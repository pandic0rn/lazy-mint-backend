

const getJwtTokenValidador = () => {
  return passport.authenticate("jwt", { session: false });
};