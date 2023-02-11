const { NODE_ENV, URL } = process.env;

let mongoUrl;
if (NODE_ENV == "production") {
  mongoUrl = "mongodb+srv://taalr:71171urgent@cluster0.8thli.mongodb.net/fcb?retryWrites=true&w=majority";
} else {
  mongoUrl = "mongodb+srv://taalr:passer1234@cluster0.8thli.mongodb.net/fcb?retryWrites=true&w=majority";
}
module.exports = {
  secret: "cookieMosterSecret",
  URL,
  mongoUrl,
  discordToken:
      NODE_ENV == "production"
          ? "NDUwOTYwNTg0MDE2Mzk2Mjg4.Dpo8Pg.CdCs5ewT5Y8KcaA_UmX4z1EWQco"
          : "NDk4MTA5NTQ2MTUwMjMyMDc0.Dpo8aw.EOrGLKnuqGqldBKzuM-XMRz1Mos"
};
