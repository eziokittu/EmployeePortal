function Test() {
  return (
    <section id="form" className="bg-white rounded-lg p-16 flex flex-col items-center gap-8 m-8 mt-16 min-h-[35rem]">
      <h1 className="text-3xl bg-white">Contact Form</h1>
      <p className="bg-white text-base">Fill out the form below and we will get back to you.</p>

      <form action="#" method="post" id="content" className="bg-white min-w-[40rem] min-h-[25rem] p-4 flex flex-col justify-between">
        <div className="input bg-white">
          <p className="bg-white">Name</p>
          <input type="text" name="name" id="name" className="bg-white rounded-md h-6 border border-gray-400 w-full mt-1 p-2"/>
        </div>

        <div className="input bg-white">
          <p className="bg-white">Email</p>
          <input type="email" name="email" id="email" className="bg-white rounded-md h-6 border border-gray-400 w-full mt-1 p-2"/>
        </div>

        <div className="input bg-white">
          <p className="bg-white">Message</p>
          <textarea rows="10" placeholder="Write your message here." className="bg-white rounded-md resize-none overflow-hidden h-36 border border-gray-400 w-full mt-1 p-2"></textarea>
        </div>

        <button type="submit" className="w-40 text-white bg-purple-700 border-none h-10 rounded-lg font-semibold text-base my-0 mx-auto transition-all duration-400 hover:bg-purple-900 hover:w-44">Submit</button>
      </form>
    </section>
  );
}

export default Test;
