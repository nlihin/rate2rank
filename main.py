from app import app, db
from app.models import User,Group,Question

if __name__ == '__main__':
    app.app_context().push()
    db.drop_all()
    db.create_all()
    db.session.add(User(username = 'mat',
                        name = 'mat',
                        email_address = 'matanlange@gmail.com',
                        password = 'test1'))

    db.session.add(User(username='shira',
                        name='shira perso',
                        email_address='matanlange@gmail.com',
                        password='123432452345'))

    user = User(username = '313388241',
                        name = 'mat',
                        email_address = 'matanlange@gmail.com',
                        password = '313388241')

    print(user.validate_password())
    print(user.validate_username())
    db.session.add(Group(number=1,name='test1'))
    db.session.add(Group(number=2, name='test2'))

    db.session.add(Question(number=1, description='some Question test '))
    db.session.add(Question(number=2, description='some Question test 3  '))

    db.session.commit()
    app.run()