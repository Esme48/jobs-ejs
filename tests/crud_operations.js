const Job = require("../models/Job")
const { seed_db, testUserPassword } = require("./util/seed_db");

 before(async () => {
    const { expect, request } = await get_chai();
    this.test_user = await seed_db();
    let req = request.execute(app).get("/session/logon").send();
    let res = await req;
    const textNoLineEnd = res.text.replaceAll("\n", "");
    this.csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd)[1];
    let cookies = res.headers["set-cookie"];
    this.csrfCookie = cookies.find((element) =>
      element.startsWith("csrfToken"),
    );
    const dataToPost = {
      email: this.test_user.email,
      password: testUserPassword,
      _csrf: this.csrfToken,
    };
    req = request
      .execute(app)
      .post("/session/logon")
      .set("Cookie", this.csrfCookie)
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send(dataToPost);
    res = await req;
    cookies = res.headers["set-cookie"];
    this.sessionCookie = cookies.find((element) =>
      element.startsWith("connect.sid"),
    );
    expect(this.csrfToken).to.not.be.undefined;
    expect(this.sessionCookie).to.not.be.undefined;
    expect(this.csrfCookie).to.not.be.undefined;
  });

it("Get the job list", async () => {
    const { expect, request } = await get_chai();

    const req = await request
        .execute(app)
        .get("/jobs")
        .set("Cookie", this.sessionCookie)
        .send()

    const res = await req;
    expect(res).to.have.status(200)
    expect(res).to.have.property("text")

    const pageParts = res.text.split("<tr>")
    expect(pageParts).to.equal(21)
})

it("Add a new job", async() => {
    const { expect, request } = await get_chai();
    const job = await factory.build("job");

    const dataToPost = {
        company: job.company,
        position: job.position,
        status: job.status,
        _csrf: this.csrfToken,
    }

    const req = request
        .execute(app)
        .post("/jobs")
        .set("Cookie", )
        .set("Cookie", this.csrfToken + ";" + this.sessionCookie)
        .set("content-type", "application/x-www-form-urlencoded")
        .send(dataToPost)

    const res = await req
    expect(res).to.have.status(200)

    const jobs = await Job.find({createdBy: this.test_user._id})
    expect(jobs.length).to.equal(21)  
})