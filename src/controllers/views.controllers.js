class ViewBookContoller {
  static async home(req, res) {
    res.render("home/index");
    return ;
  }

  static async book(req, res) {
    res.render("home/booksInfo");
    return ;
  }

}

export default ViewBookContoller;