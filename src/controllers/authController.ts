import { Request, Response } from 'express';

const generatePublicKey = (req: Request, res: Response) => {
  try {
    return res.status(200).json({ success: true, message: 'success' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'failed' });
  }
};

// route.get('/generate-public-key', (req: Request, res: Response) => {
//   res.send('Hello World with TypeScript!');
// });

export default { generatePublicKey };

// ssh -i <PATH TO YOUR KEY PAIR FILE> ec2-user@<PUBLIC DNS OF YOUR INSTANCE>
// scp -i "robotic-service.pem" -r ./ ec2-user@ec2-3-27-135-178.ap-southeast-2.compute.amazonaws.com:/home/ec2-user/app
