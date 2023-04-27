using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CharacterRecordsGenerator
{
    internal partial class RecordFormatter
    {
        private Record _targetRecord;

        public RecordFormatter(Record r)
        {
            _targetRecord = r;
            UpdateSplitRecords();
            MakeCommonRecords();
        }

        private IList<string> _publicNotes;

        private IList<string> _MedicalPostmortem;
        private IList<string> _MedicalAllergies;
        private IList<string> _MedicalCurrentPrescriptions;
        private IList<string> _MedicalHistory;
        private IList<string> _MedicalSurgicalHistory;
        private IList<string> _MedicalPhysicalEvaluations;
        private IList<string> _MedicalPsychDisorders;
        private IList<string> _MedicalPsychEvaluations;

        private IList<string> _securityRecords;
        private IList<string> _securityNotes;
        private IList<string> _securityAttitudeScc;
        private IList<string> _securityAttitudeCrew;

        private IList<string> _employmentExperience;
        private IList<string> _employmentFormalEducation;
        private IList<string> _employmentSkills;

        private void UpdateSplitRecords()
        {
            if (_targetRecord == null)
            {
                _targetRecord = new Record();
            }
            _publicNotes = _targetRecord.PublicNotes?.LineSplit();

            // Medical
            _MedicalPostmortem = _targetRecord.MedicalPostmortem?.LineSplit();
            _MedicalAllergies = _targetRecord.MedicalAllergies?.LineSplit();
            _MedicalCurrentPrescriptions = _targetRecord.MedicalCurrentPrescriptions?.LineSplit();
            _MedicalHistory = _targetRecord.MedicalHistory?.LineSplit();
            _MedicalSurgicalHistory = _targetRecord.MedicalSurgicalHistory?.LineSplit();
            _MedicalPhysicalEvaluations = _targetRecord.MedicalPhysicalEvaluations?.LineSplit();
            _MedicalPsychDisorders = _targetRecord.MedicalPsychDisorders?.LineSplit();
            _MedicalPsychEvaluations = _targetRecord.MedicalPsychEvaluations?.LineSplit();

            // security
            _securityRecords = _targetRecord.SecurityRecords?.LineSplit();
            _securityNotes = _targetRecord.SecurityNotes?.LineSplit();
            _securityAttitudeCrew = _targetRecord.SecurityAttitudeCrew?.LineSplit();
            _securityAttitudeScc = _targetRecord.SecurityAttitudeScc?.LineSplit();

            // employment
            _employmentExperience = _targetRecord.EmploymentExperience?.LineSplit();
            _employmentFormalEducation = _targetRecord.EmploymentFormalEducation?.LineSplit();
            _employmentSkills = _targetRecord.EmploymentSkills?.LineSplit();

            // flush the record cache so they're regenerated
            _commonRecords = null;
        }

        public string EmploymentRecords => MakeEmploymentRecords();
        public string MedicalRecords => MakeMedicalRecords();
        public string SecurityRecords => MakeSecurityRecords();

        private string _commonRecords;

        /// <summary>
        ///		Writes the <see cref="string"/> form of a record section to the specified <see cref="StringBuilder"/>, as long as there's entries to write.
        /// </summary>
        /// <param name="builder">The <see cref="StringBuilder"/> to write to.</param>
        /// <param name="header">The title for the section.</param>
        /// <param name="entries">The entries of this section.</param>
        private static void WriteSectionIfAny(ref StringBuilder builder, string header, IList<string> entries)
        {
            if (entries == null || !entries.Any() || entries[0].Trim().Length == 0)
                return;
            builder.AppendLine(header);
            builder.AppendLine(entries.FormatAsList());
        }

        private string MakeNameLine()
        {
            var builder = new StringBuilder("Name: ");
            builder.Append(_targetRecord.FirstName.SpaceIfValue());
            builder.Append(_targetRecord.MiddleName.SpaceIfValue());
            builder.Append(_targetRecord.LastName);
            return builder.ToString();
        }

        private static void MakeMedicalNote(ref StringBuilder b, string s) =>
            b.AppendLine($" - {s}");
    }
}
