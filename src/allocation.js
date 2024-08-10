const Student = require('./models/Student'); // Assuming you have a Student model
const Bus = require('./models/Bus'); // Assuming you have a Bus model

const allocateStudentsToBuses = async () => {
  const students = await Student.find({});
  const buses = await Bus.find({});

  for (let student of students) {
    let closestBus = null;

    for (let bus of buses) {
      // Here we are assuming the bus.Route and student.Address are strings that can be compared directly.
      if (bus.Route === student.Address && bus.Capacity > 0) {
        closestBus = bus;
        break; // If a matching bus is found, no need to check further
      }
    }

    if (closestBus) {
      closestBus.Capacity--;
      await closestBus.save();
      console.log(`Assigned student ${student.StudentName} to bus ${closestBus.Busno}`);
    } else {
      console.log(`No available bus for student ${student.StudentName}`);
    }
  }
};

module.exports = { allocateStudentsToBuses };
