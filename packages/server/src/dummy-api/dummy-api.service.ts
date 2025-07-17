import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Resend } from 'resend';

type User = {
  id: string;
  name: string;
  dob: string;
  address: string;
  mobile: string;
  age: number;
  company: string;
  email: string;
  friends: number;
  isSocialActive: boolean;
  vehicleNumber: string;
  description: string;
};

@Injectable()
export class DummyApiService {
  getWeather() {
    return {
      Mumbai:
        'Weather is Cloudy and Humid. Temperature is 28°C. Humidity is 75%. Excessive rainfall is expected.',
      'New York':
        'Weather is sunny and warm. Temperature is 30°C. Humidity is 60%. No rainfall expected.',
      London:
        'Weather is rainy and cool. Temperature is 15°C. Humidity is 80%. Light rainfall is expected.',
      Paris:
        'Weather is sunny and warm. Temperature is 25°C. Humidity is 65%. No rainfall expected.',
      Tokyo:
        'Weather is sunny and warm. Temperature is 25°C. Humidity is 65%. No rainfall expected.',
      Delhi:
        'Weather is sunny and warm. Temperature is 37°C. Humidity is 65%. No rainfall expected.',
      City_Not_Available: 'Weather information not available',
    };
  }

  getCricketSchedule() {
    return {
      'India Tour of England Test 2025': [
        {
          venue: 'Leeds',
          date: '2025-09-15',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Edgebaston',
          date: '2025-09-16',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'London - Lords',
          date: '2025-09-17',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'London - Oval',
          date: '2025-09-18',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Manchester - Old Trafford',
          date: '2025-09-19',
          time: '10:00 AM',
          status: 'Scheduled',
        },
      ],
      'England Tour of India Test 2025': [
        {
          venue: 'Mumbai',
          date: '2025-09-20',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Delhi',
          date: '2025-09-21',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Chennai',
          date: '2025-09-22',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Bangalore',
          date: '2025-09-23',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Hyderabad',
          date: '2025-09-24',
          time: '10:00 AM',
          status: 'Scheduled',
        },
      ],
      'India Tour of Australia Test 2025': [
        {
          venue: 'Sydney',
          date: '2025-09-25',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Melbourne',
          date: '2025-09-26',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Adelaide',
          date: '2025-09-27',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Perth',
          date: '2025-09-28',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Brisbane',
          date: '2025-09-29',
          time: '10:00 AM',
          status: 'Scheduled',
        },
      ],
      'Australia Tour of India Test 2026': [
        {
          venue: 'Mumbai',
          date: '2026-09-30',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Delhi',
          date: '2026-10-01',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Chennai',
          date: '2026-10-02',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Bangalore',
          date: '2026-10-03',
          time: '10:00 AM',
          status: 'Scheduled',
        },
        {
          venue: 'Hyderabad',
          date: '2026-10-04',
          time: '10:00 AM',
          status: 'Scheduled',
        },
      ],
    };
  }

  async getAllUsers() {
    const resp = await axios.get<User[]>(
      'https://686b62b1e559eba908724cdb.mockapi.io/api/researchUserDetails',
    );
    return resp.data;
  }

  async getUserByName(name: string) {
    const users = await this.getAllUsers();
    return users.find((user) =>
      user.name?.toLowerCase()?.includes(name.toLowerCase()),
    );
  }

  async getUserById(id: string) {
    const users = await this.getAllUsers();
    return users.find((user) => user.id === id);
  }

  async getUserByDOB(dob: string) {
    const users = await this.getAllUsers();
    return users.find((user) => {
      const date = new Date(dob);
      const userDate = new Date(user.dob);
      return (
        date.getMonth() === userDate.getMonth() &&
        date.getDate() === userDate.getDate()
      );
    });
  }

  async addSuspectedUser(body: { userId: string; reason: string }) {
    try {
      await axios.post(
        'https://686b62b1e559eba908724cdb.mockapi.io/api/suspectedUsers',
        body,
      );
      return 'Suspect added successfully';
    } catch (error) {
      return `Failed to add suspect: ${(error as Error).message}`;
    }
  }

  async sendEmail(body: { subject: string; body: string; to: string }) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: body.to || 'manan5401desai@gmail.com',
        subject: body.subject,
        html: body.body,
      });
      return 'Email sent successfully';
    } catch (error) {
      return `Failed to send email: ${(error as Error).message}`;
    }
  }

  async getCityCabs(city: string) {
    return new Promise((res) => {
      res('Ola: 10, Uber: 5 in ' + city);
    });
  }
}
