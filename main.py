from app import app, db
from app.models import User,Group,Question

if __name__ == '__main__':
    app.app_context().push()
    db.drop_all()
    db.create_all()


    user = User(username = '313388241',
                        name = 'mat',
                        email_address = 'matanlange@gmail.com',
                        password = '313388241')
    db.session.add(user)

    print(user.validate_password())
    print(user.validate_username())
    db.session.add(Group(number=1,name='test1'))
    db.session.add(Group(number=2, name='test2'))

    db.session.add(Question(number=1, description='some Question test '))
    db.session.add(Question(number=2, description='some Question test 3  '))

    db.session.commit()
    app.run()