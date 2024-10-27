export const endPoints = { 

     baseUrl: 'http://localhost:8000/',  
     apiBaseUrl: 'http://localhost:8000/api/',  

    api: {
      UserLogin:"auth/login",
      UserRegister:"auth/register",
      JobListing:"jobs",
      ApplyJob:"jobs/",
      GETJOB:"jobs/employer_jobs",
      GETJOBAPPLICATION:"jobs/applications",
      UPDATEJOBS:"jobs",
      DELETEJOBS:"jobs",
      ADDJOBS:"jobs",
    },
    mode: "Development",
  };
 
  export const Image_Url = "http://localhost:8000/resume"  
  
  export default {};
  