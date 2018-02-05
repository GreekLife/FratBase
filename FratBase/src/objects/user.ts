export class User {

  Username: string;
  First_Name: string;
  Last_Name: string;
  Birthday: string;
  BrotherName: string;
  Contribution: string;
  Degree: string;
  Email: string;
  Grad: string;
  ImageURL: string;
  NotificationId: string;
  Position: string;
  School: string;
  UserId: string;

  constructor(username: string, first: string, last: string, birth: string, brother: string, contribution: string, degree: string, email: string, grad: string, image: string, notif: string,
              position: string, school:string, userId: string) {

    this.Username = username;
    this.First_Name = first;
    this.Last_Name = last;
    this.Birthday = birth;
    this.BrotherName = brother;
    this.Contribution = contribution;
    this.Degree = degree;
    this.Email = email;
    this.Grad = grad;
    this.ImageURL = image;
    this.NotificationId = notif;
    this.Position = position;
    this.School = school;
    this.UserId = userId;
  }

}
