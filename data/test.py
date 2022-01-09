from datetime import datetime


def test1():
    unix_timestamp = 1284105682
    timestamp = datetime.fromtimestamp(unix_timestamp)
    print(timestamp)

    unix_timestamp += 300
    timestamp = datetime.fromtimestamp(unix_timestamp)
    print(timestamp)
    print(timestamp.date())
    print(timestamp.time())


if __name__ == "__main__":
    test1()